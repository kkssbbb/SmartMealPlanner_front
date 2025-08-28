import { UserProfile, CalorieCalculation, CoupangProduct, Recipe, PersonalizedNutritionTargets } from '../types';
import { 
  weightLossProducts, 
  muscleGainProducts, 
  maintenanceProducts
} from '../data/mockProducts';
import { getRecipesByGoal, calculateRecipeNutrition, getRecipeIngredients } from '../data/recipeData';

// 🎯 개인화 추천 컨텍스트
export interface PersonalizedContext {
  userProfile: UserProfile;
  calorieCalculation: CalorieCalculation;
  currentTime: Date;
  preferences?: {
    cuisineTypes?: string[];         // 선호 요리 종류
    allergens?: string[];            // 알레르기 유발 요소
    cookingTime?: 'quick' | 'normal' | 'slow'; // 조리 시간 선호도
    difficulty?: 'easy' | 'medium' | 'hard';   // 난이도 선호도
    priceRange?: 'budget' | 'standard' | 'premium'; // 가격대 선호도
  };
  history?: {
    purchasedProducts?: string[];    // 구매 이력
    cookedRecipes?: string[];        // 조리 이력
    favoriteIngredients?: string[];  // 선호 재료
  };
}

// 🧮 사용자별 맞춤 영양소 목표 계산
export const calculatePersonalizedNutritionTargets = (
  userProfile: UserProfile,
  calorieCalculation: CalorieCalculation
) => {
  const { goal, weight, height, age, gender } = userProfile;
  const { targetCalories } = calorieCalculation;

  // 목표별 단백질 필요량 (체중 1kg당)
  const proteinPerKg = {
    weight_loss: 1.6,    // 다이어트: 근손실 방지를 위해 높은 단백질
    maintenance: 1.2,    // 유지: 일반 권장량
    muscle_gain: 1.8     // 근성장: 높은 단백질 필요
  };

  // 개인별 단백질 필요량 계산
  const dailyProteinNeeds = weight * proteinPerKg[goal];
  const proteinCalories = dailyProteinNeeds * 4;
  const proteinPercentage = (proteinCalories / targetCalories) * 100;

  // 목표별 지방 비율 조정
  const fatPercentage = {
    weight_loss: 20,     // 다이어트: 낮은 지방
    maintenance: 30,     // 유지: 균형
    muscle_gain: 25      // 근성장: 중간 지방
  }[goal];

  // 나머지는 탄수화물
  const carbPercentage = 100 - proteinPercentage - fatPercentage;

  return {
    targetCalories,
    dailyProteinNeeds,
    macroPercentages: {
      protein: Math.max(15, Math.min(35, proteinPercentage)), // 15-35% 범위
      fat: fatPercentage,
      carb: Math.max(30, carbPercentage) // 최소 30%
    },
    macroGrams: {
      protein: dailyProteinNeeds,
      fat: (targetCalories * fatPercentage / 100) / 9,
      carb: (targetCalories * carbPercentage / 100) / 4
    }
  };
};

// 🎯 스마트 제품 추천 엔진
export const getPersonalizedProductRecommendations = (
  context: PersonalizedContext
): CoupangProduct[] => {
  const { userProfile, calorieCalculation } = context;
  const nutritionTargets = calculatePersonalizedNutritionTargets(userProfile, calorieCalculation);
  
  // 목표별 기본 제품군 선택
  let candidateProducts: CoupangProduct[] = [];
  
  switch (userProfile.goal) {
    case 'weight_loss':
      candidateProducts = [
        ...weightLossProducts,
        ...maintenanceProducts.filter(p => p.nutrition.calories < 150)
      ];
      break;
    case 'muscle_gain':
      candidateProducts = [
        ...muscleGainProducts,
        ...maintenanceProducts.filter(p => p.nutrition.protein > 15)
      ];
      break;
    case 'maintenance':
    default:
      candidateProducts = [...maintenanceProducts, ...weightLossProducts.slice(0, 2)];
      break;
  }

  // 예산 필터링 (더 현실적인 접근)
  const dailyBudget = userProfile.budget / 30; // 일일 예산
  const mealBudget = dailyBudget / 3; // 끼니당 예산
  
  const affordableProducts = candidateProducts.filter(product => {
    // 1주일치 구매 시 끼니당 비용 계산
    const productDuration = getProductDuration(product);
    const costPerMeal = (product.price / productDuration) / 3;
    return costPerMeal <= mealBudget * 2; // 예산의 200%까지 허용
  });

  // 영양소 적합성 점수 계산
  const scoredProducts = affordableProducts.map(product => ({
    product,
    score: calculateAdvancedNutrientScore(product, nutritionTargets, context)
  }));

  // 점수순 정렬 및 다양성 보장
  const sortedProducts = scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // 상위 20개 선별

  // 카테고리별 다양성 보장
  const diverseProducts = ensureProductDiversity(sortedProducts.map(sp => sp.product));
  
  return diverseProducts.slice(0, 12);
};

// 🍳 스마트 레시피 추천 엔진
export const getPersonalizedRecipeRecommendations = async (
  context: PersonalizedContext
): Promise<Recipe[]> => {
  const { userProfile } = context;
  const baseRecipes = await getRecipesByGoal(userProfile.goal);
  
  // 시간대별 필터링
  const currentHour = context.currentTime.getHours();
  let mealType: 'breakfast' | 'lunch' | 'dinner';
  
  if (currentHour < 11) mealType = 'breakfast';
  else if (currentHour < 17) mealType = 'lunch'; 
  else mealType = 'dinner';

  // 사용자 선호도 반영
  let filteredRecipes = baseRecipes.filter((recipe: Recipe) => {
    // 시간대 맞춤
    if (recipe.mealType !== mealType) return false;
    
    // 조리시간 선호도
    if (context.preferences?.cookingTime === 'quick' && recipe.cookingTime > 15) return false;
    if (context.preferences?.cookingTime === 'slow' && recipe.cookingTime < 20) return false;
    
    // 난이도 선호도
    if (context.preferences?.difficulty && recipe.difficulty !== context.preferences.difficulty) {
      return false;
    }
    
    return true;
  });

  // 영양 목표에 맞는 레시피 점수 계산
  const nutritionTargets = calculatePersonalizedNutritionTargets(userProfile, context.calorieCalculation);
  
  const scoredRecipes = filteredRecipes.map((recipe: Recipe) => ({
    recipe,
    score: calculateRecipePersonalizationScore(recipe, nutritionTargets, context)
  }));

  // 점수순 정렬
  return scoredRecipes
    .sort((a: any, b: any) => b.score - a.score)
    .map((sr: any) => sr.recipe)
    .slice(0, 6);
};

// 🎯 고급 영양소 점수 계산
const calculateAdvancedNutrientScore = (
  product: CoupangProduct,
  targets: ReturnType<typeof calculatePersonalizedNutritionTargets>,
  context: PersonalizedContext
): number => {
  let score = 0;
  const nutrition = product.nutrition;
  
  // 목표 칼로리 대비 적합성 (30%)
  const calorieRatio = nutrition.calories / targets.targetCalories * 100;
  if (calorieRatio > 5 && calorieRatio < 25) score += 30;
  else if (calorieRatio <= 5) score += 20;
  
  // 단백질 함량 평가 (25%)
  if (context.userProfile.goal === 'weight_loss' || context.userProfile.goal === 'muscle_gain') {
    if (nutrition.protein > 20) score += 25;
    else if (nutrition.protein > 15) score += 20;
    else if (nutrition.protein > 10) score += 10;
  } else {
    if (nutrition.protein > 5) score += 25;
  }
  
  // 지방 함량 평가 (20%)
  const fatRatio = (nutrition.fat * 9) / nutrition.calories * 100;
  if (context.userProfile.goal === 'weight_loss' && fatRatio < 30) score += 20;
  else if (context.userProfile.goal === 'muscle_gain' && fatRatio > 20 && fatRatio < 40) score += 20;
  else if (context.userProfile.goal === 'maintenance' && fatRatio > 25 && fatRatio < 35) score += 20;
  
  // 나트륨 함량 평가 (15%)
  if (nutrition.sodium < 300) score += 15;
  else if (nutrition.sodium < 500) score += 10;
  else if (nutrition.sodium < 800) score += 5;
  
  // 가격 대비 영양가 (10%)
  const nutritionValue = (nutrition.protein * 4 + nutrition.carb * 4 + nutrition.fat * 9);
  const pricePerNutrition = product.price / nutritionValue;
  if (pricePerNutrition < 50) score += 10;
  else if (pricePerNutrition < 100) score += 5;
  
  return Math.min(100, score);
};

// 🍳 레시피 개인화 점수 계산
const calculateRecipePersonalizationScore = (
  recipe: Recipe,
  targets: ReturnType<typeof calculatePersonalizedNutritionTargets>,
  context: PersonalizedContext
): number => {
  let score = 0;
  
  // 목표 적합성 (40%)
  if (recipe.goalFit.includes(context.userProfile.goal)) score += 40;
  
  // 조리시간 적합성 (20%)
  if (context.preferences?.cookingTime === 'quick' && recipe.cookingTime <= 15) score += 20;
  else if (context.preferences?.cookingTime === 'normal' && recipe.cookingTime <= 30) score += 20;
  else if (context.preferences?.cookingTime === 'slow' && recipe.cookingTime > 30) score += 20;
  else score += 10;
  
  // 난이도 적합성 (15%)
  if (context.preferences?.difficulty === recipe.difficulty) score += 15;
  else score += 5;
  
  // 영양소 균형 (15%)
  const recipeNutrition = calculateRecipeNutrition(recipe.id);
  if (recipeNutrition.calories > 0) {
    const proteinRatio = (recipeNutrition.protein * 4) / recipeNutrition.calories * 100;
    const targetProteinRatio = targets.macroPercentages.protein;
    
    if (Math.abs(proteinRatio - targetProteinRatio) < 10) score += 15;
    else if (Math.abs(proteinRatio - targetProteinRatio) < 20) score += 10;
  }
  
  // 최근 조리 이력 (10%) - 다양성 보장
  if (context.history?.cookedRecipes && !context.history.cookedRecipes.includes(recipe.id)) {
    score += 10;
  } else {
    score += 5;
  }
  
  return Math.min(100, score);
};

// 🛡️ 제품 다양성 보장
const ensureProductDiversity = (products: CoupangProduct[]): CoupangProduct[] => {
  const categorySet = new Set(products.map(p => p.category));
  const categories = Array.from(categorySet);
  const diverseProducts: CoupangProduct[] = [];
  
  // 카테고리별로 최소 1개씩 선택
  categories.forEach(category => {
    const categoryProducts = products.filter(p => p.category === category);
    if (categoryProducts.length > 0) {
      diverseProducts.push(categoryProducts[0]);
    }
  });
  
  // 나머지 자리는 점수 순으로 채우기
  const remainingProducts = products.filter(p => !diverseProducts.includes(p));
  diverseProducts.push(...remainingProducts.slice(0, 12 - diverseProducts.length));
  
  return diverseProducts;
};

// 📦 제품 지속 기간 추정 (일 단위)
const getProductDuration = (product: CoupangProduct): number => {
  // 제품명과 용량 정보로 지속 기간 추정
  if (product.weight.includes('30팩')) return 30;
  if (product.weight.includes('20개') || product.weight.includes('20팩')) return 20;
  if (product.weight.includes('15팩')) return 15;
  if (product.weight.includes('12개') || product.weight.includes('12팩')) return 12;
  if (product.weight.includes('10팩') || product.weight.includes('10개')) return 10;
  if (product.weight.includes('8팩') || product.weight.includes('8개')) return 8;
  if (product.weight.includes('6개') || product.weight.includes('6팩')) return 6;
  if (product.weight.includes('5kg')) return 20; // 5kg 제품은 약 20일
  if (product.weight.includes('3kg')) return 15; // 3kg 제품은 약 15일
  if (product.weight.includes('500g')) return 5;  // 500g 제품은 약 5일
  return 7; // 기본값: 1주일
};

// 💰 레시피별 월간 비용 계산 (정확한 계산)
const calculateRecipeMonthlyCost = (recipeId: string, monthlyFrequency: number = 10): number => {
  const ingredients = getRecipeIngredients(recipeId);
  let totalMonthlyCost = 0;

  ingredients.forEach(ingredient => {
    const product = ingredient.product;
    const productDuration = getProductDuration(product); // 제품 지속 기간 (일)
    const recipesPerProduct = productDuration; // 한 제품으로 만들 수 있는 레시피 수
    const costPerRecipe = product.price / recipesPerProduct; // 레시피 1회당 비용
    const monthlyCost = costPerRecipe * monthlyFrequency; // 월간 해당 재료 비용
    
    totalMonthlyCost += monthlyCost;
  });

  return Math.round(totalMonthlyCost);
};

// 🍽️ 구매한 재료로 레시피를 몇 번 해먹을 수 있는지 계산
export const calculateRecipeFrequency = (recipeId: string): {
  recipeId: string;
  recipeName: string;
  ingredientAnalysis: Array<{
    productName: string;
    productPackageSize: string;
    usagePerRecipe: string;
    maxRecipesFromThisIngredient: number;
    costPerRecipe: number;
    totalProductCost: number;
  }>;
  minPossibleRecipes: number; // 가장 적게 만들 수 있는 횟수 (병목 재료 기준)
  averageRecipesPerIngredient: number;
  totalCostPerRecipe: number;
} => {
  const ingredients = getRecipeIngredients(recipeId);
  // recipes 배열이 없으므로 임시 레시피 정보 사용
  const recipe = { id: recipeId, name: `레시피 ${recipeId}` };
  
  const ingredientAnalysis = ingredients.map((ingredient: any) => {
    const product = ingredient.product;
    
    // 📦 정확한 제품 패키지 분석 (실제 mock 데이터 기준)
    const analyzePackage = (packageInfo: string): { totalAmount: number, unitType: string } => {
      console.log(`🔍 패키지 분석 중: "${packageInfo}"`); // 디버그용
      
      // 패턴: "단위 x 개수" 형태 분석
      
      // 1️⃣ "100g x 30팩" 형태
      const gramPackPattern = /(\d+)g\s*x\s*(\d+)/i;
      const gramPackMatch = packageInfo.match(gramPackPattern);
      if (gramPackMatch) {
        const perPack = parseInt(gramPackMatch[1]);
        const packCount = parseInt(gramPackMatch[2]);
        console.log(`📦 그램팩: ${perPack}g x ${packCount}팩 = ${perPack * packCount}g`);
        return { totalAmount: perPack * packCount, unitType: 'g' };
      }
      
      // 2️⃣ "150g x 12개" 형태  
      const gramItemPattern = /(\d+)g\s*x\s*(\d+)개/i;
      const gramItemMatch = packageInfo.match(gramItemPattern);
      if (gramItemMatch) {
        const perItem = parseInt(gramItemMatch[1]);
        const itemCount = parseInt(gramItemMatch[2]);
        console.log(`📦 그램개수: ${perItem}g x ${itemCount}개 = ${perItem * itemCount}g`);
        return { totalAmount: perItem * itemCount, unitType: 'g' };
      }
      
      // 3️⃣ "5kg" 단일 형태
      const singleKgPattern = /(\d+)kg/i;
      const singleKgMatch = packageInfo.match(singleKgPattern);
      if (singleKgMatch) {
        const kg = parseInt(singleKgMatch[1]);
        console.log(`📦 킬로그램: ${kg}kg = ${kg * 1000}g`);
        return { totalAmount: kg * 1000, unitType: 'g' };
      }
      
      // 4️⃣ "500g" 단일 형태
      const singleGramPattern = /(\d+)g(?!\s*x)/i;
      const singleGramMatch = packageInfo.match(singleGramPattern);
      if (singleGramMatch) {
        const grams = parseInt(singleGramMatch[1]);
        console.log(`📦 그램: ${grams}g`);
        return { totalAmount: grams, unitType: 'g' };
      }
      
      // 5️⃣ "12개" 단일 개수 형태
      const singleCountPattern = /(\d+)개(?!\s*[×x])/i;
      const singleCountMatch = packageInfo.match(singleCountPattern);
      if (singleCountMatch) {
        const count = parseInt(singleCountMatch[1]);
        console.log(`📦 개수: ${count}개`);
        return { totalAmount: count, unitType: '개' };
      }
      
      // 6️⃣ "2L" 리터 형태
      const literPattern = /(\d+(?:\.\d+)?)L/i;
      const literMatch = packageInfo.match(literPattern);
      if (literMatch) {
        const liters = parseFloat(literMatch[1]);
        console.log(`📦 리터: ${liters}L = ${liters * 1000}ml`);
        return { totalAmount: liters * 1000, unitType: 'ml' };
      }
      
      // 7️⃣ "500ml" 밀리리터 형태
      const mlPattern = /(\d+)ml/i;
      const mlMatch = packageInfo.match(mlPattern);
      if (mlMatch) {
        const ml = parseInt(mlMatch[1]);
        console.log(`📦 밀리리터: ${ml}ml`);
        return { totalAmount: ml, unitType: 'ml' };
      }
      
      console.warn(`⚠️ 패키지 정보 분석 실패: "${packageInfo}" - 기본값 사용`);
      return { totalAmount: 100, unitType: 'g' }; // 기본값
    };
    
    const packageAnalysis = analyzePackage(product.weight);
    const packageTotalAmount = packageAnalysis.totalAmount;
    const packageUnitType = packageAnalysis.unitType;
    const recipeUsage = ingredient.quantity;
    const recipeUnit = ingredient.unit;
    
    console.log(`🧮 계산 중: ${product.name}`);
    console.log(`📦 패키지: ${packageTotalAmount}${packageUnitType}`);
    console.log(`🥄 레시피 사용량: ${recipeUsage}${recipeUnit}`);
    
    // 🔢 단위 통일 후 계산
    let maxRecipesFromThisIngredient: number;
    
    if (recipeUnit === 'g' && (packageUnitType === 'g' || packageUnitType === 'ml')) {
      // 그램 단위: 직접 계산 가능
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeUsage);
    } else if (recipeUnit === 'ml' && packageUnitType === 'ml') {
      // 밀리리터 단위: 직접 계산 가능
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeUsage);
    } else if (recipeUnit === '개' && packageUnitType === '개') {
      // 개수 단위: 직접 계산 가능
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeUsage);
    } else if (recipeUnit === '큰술') {
      // 큰술 = 약 15ml/15g
      const recipeAmountInGrams = recipeUsage * 15;
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeAmountInGrams);
    } else if (recipeUnit === '작은술') {
      // 작은술 = 약 5ml/5g
      const recipeAmountInGrams = recipeUsage * 5;
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeAmountInGrams);
    } else if (recipeUnit === '컵') {
      // 컵 = 약 200ml/200g
      const recipeAmountInGrams = recipeUsage * 200;
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / recipeAmountInGrams);
    } else {
      // 기타 단위: 보수적 계산
      console.warn(`⚠️ 단위 변환 불가: ${recipeUnit} ↔ ${packageUnitType}`);
      maxRecipesFromThisIngredient = Math.floor(packageTotalAmount / (recipeUsage * 10));
    }
    
    // 🛡️ 0으로 나누기 방지
    if (maxRecipesFromThisIngredient <= 0) {
      console.warn(`⚠️ 계산 결과가 0 이하: ${product.name} - 최소값 1로 설정`);
      maxRecipesFromThisIngredient = 1;
    }
    
    const costPerRecipe = Math.round(product.price / maxRecipesFromThisIngredient);
    
    console.log(`✅ 결과: ${maxRecipesFromThisIngredient}번 가능, 1회당 ${costPerRecipe}원`);
    
    return {
      productName: product.name,
      productPackageSize: product.weight,
      usagePerRecipe: `${recipeUsage}${recipeUnit}`,
      maxRecipesFromThisIngredient: maxRecipesFromThisIngredient,
      costPerRecipe: costPerRecipe,
      totalProductCost: product.price
    };
  });
  
  // 🎯 병목 재료 찾기 (가장 적게 만들 수 있는 횟수)
  const minPossibleRecipes = Math.min(...ingredientAnalysis.map(analysis => analysis.maxRecipesFromThisIngredient));
  
  // 📊 평균 제조 가능 횟수
  const averageRecipesPerIngredient = Math.round(
    ingredientAnalysis.reduce((sum, analysis) => sum + analysis.maxRecipesFromThisIngredient, 0) / ingredientAnalysis.length
  );
  
  // 💰 레시피 1회당 총 비용
  const totalCostPerRecipe = ingredientAnalysis.reduce((sum, analysis) => sum + analysis.costPerRecipe, 0);
  
  return {
    recipeId,
    recipeName: recipe?.name || '알 수 없는 레시피',
    ingredientAnalysis,
    minPossibleRecipes,
    averageRecipesPerIngredient,
    totalCostPerRecipe: Math.round(totalCostPerRecipe)
  };
};

// 💰 예산 기반 레시피 필터링 및 조합 선택
const getBudgetAwareRecipeCombination = (
  goalRecipes: Recipe[], 
  monthlyBudget: number,
  nutritionTargets: PersonalizedNutritionTargets
): Recipe[] => {
  // 각 레시피의 월간 비용과 영양가 계산
  const recipeAnalysis = goalRecipes.map(recipe => {
    const monthlyCost = calculateRecipeMonthlyCost(recipe.id, 10); // 한 달에 10번 해당 레시피
    const nutrition = calculateRecipeNutrition(recipe.id);
    const nutritionScore = (nutrition.protein * 4 + nutrition.carb * 4 + nutrition.fat * 9) / monthlyCost; // 원당 영양가
    
    return {
      recipe,
      monthlyCost,
      nutrition,
      nutritionScore,
      costPerCalorie: monthlyCost / (nutrition.calories || 1)
    };
  });

  // 예산 범위 내 레시피들만 필터링
  const affordableRecipes = recipeAnalysis.filter(analysis => 
    analysis.monthlyCost <= monthlyBudget * 0.4 // 단일 레시피가 예산의 40%를 넘지 않도록
  );

  if (affordableRecipes.length === 0) {
    // 예산이 너무 적으면 가장 저렴한 레시피들 선택
    const sortedByCost = recipeAnalysis.sort((a, b) => a.monthlyCost - b.monthlyCost);
    return sortedByCost.slice(0, 3).map(analysis => analysis.recipe);
  }

  // 🎯 최적 조합 찾기 (예산 내에서 영양가 최대화) - 성능 최적화
  const findOptimalCombination = (): Recipe[] => {
    const combinations: Recipe[][] = [];
    const maxCombinations = 1000; // 조합 수 제한으로 성능 향상
    
    // 가격 기준 사전 정렬로 조기 종료 최적화
    const sortedByPrice = affordableRecipes.sort((a, b) => a.monthlyCost - b.monthlyCost);
    
    // 아침, 점심, 저녁용 레시피를 각각 선택 (최적화된 루프)
    outerLoop: for (let i = 0; i < sortedByPrice.length && combinations.length < maxCombinations; i++) {
      const breakfast = sortedByPrice[i];
      
      for (let j = 0; j < sortedByPrice.length && combinations.length < maxCombinations; j++) {
        const lunch = sortedByPrice[j];
        
        // 조기 종료 조건 (2개 합계가 이미 예산 초과)
        if (breakfast.monthlyCost + lunch.monthlyCost > monthlyBudget * 0.9) {
          continue;
        }
        
        for (let k = 0; k < sortedByPrice.length && combinations.length < maxCombinations; k++) {
          const dinner = sortedByPrice[k];
          const totalCost = breakfast.monthlyCost + lunch.monthlyCost + dinner.monthlyCost;
          
          if (totalCost <= monthlyBudget) {
            combinations.push([breakfast.recipe, lunch.recipe, dinner.recipe]);
          } else {
            // 가격순 정렬되어 있으므로 더 이상 확인 불필요
            break;
          }
        }
      }
    }

    if (combinations.length === 0) {
      // 3개 조합이 불가능하면 가장 저렴한 2개 선택
      const sortedByCost = affordableRecipes.sort((a, b) => a.monthlyCost - b.monthlyCost);
      return sortedByCost.slice(0, 2).map(analysis => analysis.recipe);
    }

    // 영양가 점수가 가장 높은 조합 선택
    let bestCombination = combinations[0];
    let bestScore = 0;

    combinations.forEach(combination => {
      const totalNutrition = combination.reduce((sum, recipe) => {
        const nutrition = calculateRecipeNutrition(recipe.id);
        return {
          calories: sum.calories + nutrition.calories,
          protein: sum.protein + nutrition.protein,
          carb: sum.carb + nutrition.carb,
          fat: sum.fat + nutrition.fat
        };
      }, { calories: 0, protein: 0, carb: 0, fat: 0 });

      // 목표 영양소와의 근사도 점수
      const calorieScore = 100 - Math.abs(totalNutrition.calories - nutritionTargets.targetCalories) / nutritionTargets.targetCalories * 100;
      const proteinScore = 100 - Math.abs(totalNutrition.protein - nutritionTargets.macroGrams.protein) / nutritionTargets.macroGrams.protein * 100;
      
      const combinationScore = Math.max(0, calorieScore) + Math.max(0, proteinScore);

      if (combinationScore > bestScore) {
        bestScore = combinationScore;
        bestCombination = combination;
      }
    });

    return bestCombination;
  };

  return findOptimalCombination();
};

// 🎯 전체 개인화 추천 통합 함수
export const generatePersonalizedRecommendations = (
  userProfile: UserProfile,
  calorieCalculation: CalorieCalculation,
  preferences?: PersonalizedContext['preferences'],
  history?: PersonalizedContext['history']
) => {
  const context: PersonalizedContext = {
    userProfile,
    calorieCalculation,
    currentTime: new Date(),
    preferences,
    history
  };

  const nutritionTargets = calculatePersonalizedNutritionTargets(userProfile, calorieCalculation);
  const recommendedProducts = getPersonalizedProductRecommendations(context);
  const recommendedRecipes = getPersonalizedRecipeRecommendations(context);

  // 개인화 메시지 생성
  const personalizedMessage = generatePersonalizedMessage(userProfile, nutritionTargets);

  return {
    nutritionTargets,
    recommendedProducts,
    recommendedRecipes,
    personalizedMessage,
    context
  };
};

// 💰 예산 고려 개인화 추천 함수 (메인)
export const generateBudgetAwareRecommendations = async (
  userProfile: UserProfile,
  calorieCalculation: CalorieCalculation,
  monthlyBudget: number,
  preferences?: PersonalizedContext['preferences'],
  history?: PersonalizedContext['history']
): Promise<{
  personalizedMessage: string;
  nutritionTargets: PersonalizedNutritionTargets;
  recommendedProducts: CoupangProduct[];
  recommendedRecipes: Recipe[];
  budgetAnalysis: {
    totalEstimatedCost: number;
    budgetUsagePercentage: number;
    costBreakdown: Array<{
      recipeId: string;
      recipeName: string;
      monthlyCost: number;
      costPercentage: number;
    }>;
  };
  context: PersonalizedContext;
}> => {
  const context: PersonalizedContext = {
    userProfile,
    calorieCalculation,
    currentTime: new Date(),
    preferences,
    history
  };

  const nutritionTargets = calculatePersonalizedNutritionTargets(userProfile, calorieCalculation);
  
  // 🎯 목표에 맞는 모든 레시피 가져오기 (비동기)
  const goalRecipes = await getRecipesByGoal(userProfile.goal || 'maintenance');
  
  // 💰 예산 기반 최적 레시피 조합 선택
  const budgetOptimizedRecipes = getBudgetAwareRecipeCombination(
    goalRecipes, 
    monthlyBudget, 
    nutritionTargets
  );

  // 📊 예산 분석
  const costBreakdown = budgetOptimizedRecipes.map(recipe => {
    const monthlyCost = calculateRecipeMonthlyCost(recipe.id, 10);
    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      monthlyCost,
      costPercentage: (monthlyCost / monthlyBudget) * 100
    };
  });

  const totalEstimatedCost = costBreakdown.reduce((sum, item) => sum + item.monthlyCost, 0);
  const budgetUsagePercentage = (totalEstimatedCost / monthlyBudget) * 100;

  // 제품 추천은 기존 로직 활용
  const recommendedProducts = getPersonalizedProductRecommendations(context);

  // 💬 예산 고려 메시지 생성
  const personalizedMessage = generateBudgetAwareMessage(
    userProfile, 
    nutritionTargets, 
    monthlyBudget, 
    totalEstimatedCost
  );

  return {
    personalizedMessage,
    nutritionTargets,
    recommendedProducts,
    recommendedRecipes: budgetOptimizedRecipes,
    budgetAnalysis: {
      totalEstimatedCost,
      budgetUsagePercentage,
      costBreakdown
    },
    context
  };
};

// 💬 개인화 메시지 생성
const generatePersonalizedMessage = (
  userProfile: UserProfile,
  targets: ReturnType<typeof calculatePersonalizedNutritionTargets>
): string => {
  const { goal, gender, age, weight } = userProfile;
  const { targetCalories, dailyProteinNeeds } = targets;

  const goalMessages = {
    weight_loss: `${gender === 'male' ? '형' : '님'}의 다이어트 성공을 위해 일일 ${targetCalories}kcal, 단백질 ${Math.round(dailyProteinNeeds)}g 목표로 맞춤 식단을 준비했어요! 💪`,
    muscle_gain: `${age}세 ${gender === 'male' ? '형' : '님'}의 근성장을 위해 일일 ${targetCalories}kcal, 고단백 ${Math.round(dailyProteinNeeds)}g 식단으로 구성했어요! 🔥`, 
    maintenance: `${weight}kg 건강 유지를 위해 일일 ${targetCalories}kcal 균형 잡힌 식단을 추천드려요! ⚖️`
  };

  return goalMessages[goal] || '맞춤형 식단을 준비했어요! 🎯';
};

// 💰 예산 고려 메시지 생성
const generateBudgetAwareMessage = (
  userProfile: UserProfile,
  targets: ReturnType<typeof calculatePersonalizedNutritionTargets>,
  monthlyBudget: number,
  estimatedCost: number
): string => {
  const { goal, gender } = userProfile;
  const { targetCalories, dailyProteinNeeds } = targets;
  const savings = monthlyBudget - estimatedCost;
  const usagePercentage = (estimatedCost / monthlyBudget) * 100;

  const baseMessage = `${gender === 'male' ? '형' : '님'}의 ${goal === 'weight_loss' ? '다이어트' : goal === 'muscle_gain' ? '근성장' : '건강유지'} 목표에 맞춰`;

  if (usagePercentage <= 70) {
    return `${baseMessage} 예산을 알뜰하게 활용한 식단을 준비했어요! 💰 월 ${estimatedCost.toLocaleString()}원으로 목표 달성이 가능해요 (${savings.toLocaleString()}원 절약!) 🎯`;
  } else if (usagePercentage <= 90) {
    return `${baseMessage} 예산에 딱 맞는 효율적인 식단을 구성했어요! 💪 월 ${estimatedCost.toLocaleString()}원으로 목표 영양소를 충족할 수 있어요! 🎯`;
  } else {
    return `${baseMessage} 예산을 최대한 활용한 가성비 최고의 식단이에요! 💯 월 ${estimatedCost.toLocaleString()}원으로 최고의 영양 효과를 얻으세요! 🔥`;
  }
};
