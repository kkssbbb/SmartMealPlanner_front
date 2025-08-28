import { Recipe, CoupangProduct, RecipeIngredient } from '../types';
import { mockProducts } from '../data/mockProducts';

// 🍳 만개의 레시피 원본 데이터 구조
export interface MankaeLRecipeRaw {
  RCP_SNO: string;           // 레시피 번호
  RCP_TTL: string;           // 레시피 제목
  CKG_NM: string;            // 요리명
  RGTR_ID: string;           // 등록자 ID
  RGTR_NM: string;           // 등록자명 (요리사)
  INQ_CNT: number;           // 조회수
  RCMM_CNT: number;          // 추천수
  SRAP_CNT: number;          // 스크랩수
  CKG_MTH_ACTO_NM: string;   // 조리법 (부침, 찜, 볶음, 끓이기)
  CKG_STA_ACTO_NM: string;   // 상황 (영양식, 일상, 초스피드, 술안주)
  CKG_MTRL_ACTO_NM: string;  // 주재료 (달걀/유제품, 채소류, 소고기)
  CKG_KND_ACTO_NM: string;   // 요리종류 (밑반찬, 메인반찬, 국/탕)
  CKG_IPDC: string;          // 요리소개
  CKG_MTRL_CN: string;       // 재료 정보
  CKG_INBUN_NM: string;      // 인분
  CKG_DODF_NM: string;       // 난이도
  CKG_TIME_NM: string;       // 조리시간
  FIRST_REG_DT: string;      // 등록일
  RCP_IMG_URL?: string;      // 레시피 이미지 URL
}

// 🧮 AI 기반 영양소 계산기
class NutritionCalculator {
  // 기본 영양 데이터베이스 (농진청 기준)
  private nutritionDB: Record<string, { calories: number; protein: number; carb: number; fat: number; per100g: boolean }> = {
    // 🥚 단백질류
    '계란': { calories: 155, protein: 12.6, carb: 1.1, fat: 11.1, per100g: true },
    '비엔나': { calories: 315, protein: 12.0, carb: 2.0, fat: 28.5, per100g: true },
    '훈제연어': { calories: 117, protein: 25.4, carb: 0, fat: 4.3, per100g: true },
    '우삼겹': { calories: 331, protein: 15.0, carb: 0, fat: 30.0, per100g: true },
    
    // 🥬 채소류
    '알배기배추': { calories: 14, protein: 1.3, carb: 2.8, fat: 0.1, per100g: true },
    '당근': { calories: 37, protein: 0.8, carb: 8.8, fat: 0.2, per100g: true },
    '마늘': { calories: 130, protein: 6.2, carb: 28.4, fat: 0.3, per100g: true },
    '대파': { calories: 27, protein: 1.4, carb: 6.2, fat: 0.1, per100g: true },
    '양파': { calories: 37, protein: 1.0, carb: 8.9, fat: 0.1, per100g: true },
    '아보카도': { calories: 190, protein: 2.0, carb: 8.6, fat: 19.5, per100g: true },
    '숙주': { calories: 13, protein: 1.4, carb: 2.1, fat: 0.1, per100g: true },
    '깻잎': { calories: 41, protein: 3.9, carb: 7.1, fat: 0.7, per100g: true },
    
    // 🍚 곡물류
    '밥': { calories: 130, protein: 2.5, carb: 29.0, fat: 0.3, per100g: true },
    '떡볶이떡': { calories: 124, protein: 2.6, carb: 28.0, fat: 0.4, per100g: true },
    
    // 🧄 조미료류
    '소금': { calories: 0, protein: 0, carb: 0, fat: 0, per100g: true },
    '간장': { calories: 53, protein: 8.9, carb: 4.6, fat: 0.1, per100g: true },
    '설탕': { calories: 387, protein: 0, carb: 99.8, fat: 0, per100g: true },
    '참기름': { calories: 900, protein: 0, carb: 0, fat: 100, per100g: true },
    '마요네즈': { calories: 680, protein: 1.1, carb: 2.9, fat: 75.3, per100g: true },
    '땅콩버터': { calories: 588, protein: 22.5, carb: 22.3, fat: 49.9, per100g: true }
  };
  
  // 단위 변환기
  private convertToGrams(quantity: number, unit: string, ingredientName: string): number {
    const conversions: Record<string, number> = {
      'g': 1,
      'kg': 1000,
      'ml': 1, // 물 기준 1ml = 1g
      '개': this.getItemWeight(ingredientName),
      '장': this.getSheetWeight(ingredientName),
      '통': this.getWholeWeight(ingredientName),
      '공기': 150, // 밥 1공기
      '봉': this.getPackageWeight(ingredientName),
      '단': this.getBunchWeight(ingredientName),
      'T': 15, // 큰술
      't': 5,  // 작은술
      '큰술': 15,
      '작은술': 5,
      '스푼': 15
    };
    
    return quantity * (conversions[unit] || 50); // 기본값 50g
  }
  
  private getItemWeight(ingredientName: string): number {
    const weights: Record<string, number> = {
      '계란': 50,   // 계란 1개 = 50g
      '마늘': 5,    // 마늘 1개 = 5g  
      '양파': 200,  // 양파 1개 = 200g
      '감자': 150,  // 감자 1개 = 150g
      '당근': 100   // 당근 1개 = 100g
    };
    return weights[ingredientName] || 50;
  }
  
  private getSheetWeight(ingredientName: string): number {
    const weights: Record<string, number> = {
      '사각어묵': 25,  // 어묵 1장 = 25g
      '알배추잎': 30,  // 배추잎 1장 = 30g
      '깻잎': 1        // 깻잎 1장 = 1g
    };
    return weights[ingredientName] || 20;
  }
  
  private getWholeWeight(ingredientName: string): number {
    const weights: Record<string, number> = {
      '알배기배추': 1500  // 배추 1통 = 1.5kg
    };
    return weights[ingredientName] || 500;
  }
  
  private getPackageWeight(ingredientName: string): number {
    const weights: Record<string, number> = {
      '숙주': 200,      // 숙주 1봉 = 200g
      '팽이버섯': 150   // 팽이버섯 1봉 = 150g
    };
    return weights[ingredientName] || 100;
  }
  
  private getBunchWeight(ingredientName: string): number {
    const weights: Record<string, number> = {
      '대파': 100,      // 대파 1단 = 100g
      '얼갈이': 300     // 얼갈이 1단 = 300g
    };
    return weights[ingredientName] || 100;
  }
  
  // 영양소 계산
  calculateNutrition(ingredients: Array<{name: string; quantity: number; unit: string}>): {
    calories: number; protein: number; carb: number; fat: number;
  } {
    let totalNutrition = { calories: 0, protein: 0, carb: 0, fat: 0 };
    
    ingredients.forEach(ingredient => {
      const baseNutrition = this.nutritionDB[ingredient.name];
      if (baseNutrition) {
        const gramsUsed = this.convertToGrams(ingredient.quantity, ingredient.unit, ingredient.name);
        const ratio = gramsUsed / 100; // 100g 기준으로 계산
        
        totalNutrition.calories += baseNutrition.calories * ratio;
        totalNutrition.protein += baseNutrition.protein * ratio;
        totalNutrition.carb += baseNutrition.carb * ratio;
        totalNutrition.fat += baseNutrition.fat * ratio;
      }
    });
    
    return {
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carb: Math.round(totalNutrition.carb * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10
    };
  }
}

// 🤖 AI 기반 목표 분류기
class GoalClassifier {
  classifyRecipeGoals(
    ingredients: Array<{name: string; quantity: number; unit: string}>,
    cookingMethod: string,
    mealPurpose: string,
    description: string,
    nutrition: {calories: number; protein: number; carb: number; fat: number}
  ): ('weight_loss' | 'muscle_gain' | 'maintenance')[] {
    const goals: ('weight_loss' | 'muscle_gain' | 'maintenance')[] = [];
    
    // 🔥 다이어트 분류 로직 (스마트 분류)
    const isLowCalorie = nutrition.calories < 400;
    
    // 채소 기반 재료 확인 (더 포괄적)
    const vegetableKeywords = ['배추', '숙주', '깻잎', '브로콜리', '양배추', '샐러드', '야채', '채소', '무', '당근', '시금치', '버섯', '콩나물'];
    const isVegetableBased = ingredients.some(ing => {
      const ingName = ing.name.toLowerCase();
      return vegetableKeywords.some(veg => ingName.includes(veg));
    });
    
    // 다이어트 친화적 조리법
    const lightCookingMethods = ['찌기', '삶기', '무침'];
    const isLightCooking = lightCookingMethods.includes(cookingMethod);
    
    // 국물 요리 (포만감 높고 칼로리 낮음)
    const isSoupBased = cookingMethod === '국/탕' || description.includes('국') || description.includes('탕');
    
    // 다이어트 키워드 (기존 + 추가)
    const dietKeywords = ['다이어트', '저칼로리', '살빼기', '헬시', '건강'];
    const hasDietKeyword = dietKeywords.some(keyword => description.toLowerCase().includes(keyword));
    
    // 다이어트 레시피 판정 (더 관대하게)
    if (isLowCalorie || isVegetableBased || isLightCooking || isSoupBased || hasDietKeyword) {
      goals.push('weight_loss');
    }
    
    // 💪 근성장 분류 로직 (스마트 분류)
    const isHighProtein = nutrition.protein > 20;
    
    // 단백질 재료 확인 (더 포괄적)
    const proteinKeywords = ['계란', '달걀', '닭', '소고기', '돼지', '연어', '참치', '두부', '새우', '조개', '생선', '육'];
    const hasProteinSource = ingredients.some(ing => {
      const ingName = ing.name.toLowerCase();
      return proteinKeywords.some(protein => ingName.includes(protein));
    });
    
    // 고단백 조리법
    const proteinCookingMethods = ['굽기', '볶기', '튀기기'];
    const isProteinCooking = proteinCookingMethods.includes(cookingMethod);
    
    // 근성장 키워드
    const muscleKeywords = ['단백질', '근육', '고단백', '프로틴'];
    const hasMuscleKeyword = muscleKeywords.some(keyword => description.toLowerCase().includes(keyword));
    
    // 근성장 레시피 판정
    if (isHighProtein || hasProteinSource || isProteinCooking || hasMuscleKeyword) {
      goals.push('muscle_gain');
    }
    
    // 🥘 균형 잡힌 식단 (maintenance) - 모든 레시피가 최소 하나의 목표를 가지도록
    if (goals.length === 0 || cookingMethod === '국/탕' || mealPurpose === '일상') {
      goals.push('maintenance');
    }
    
    return goals;
  }
}

// 🛒 쿠팡 상품 매칭기
class CoupangProductMatcher {
  private findMatchingProduct(ingredientName: string): CoupangProduct | null {
    // 재료명 → 쿠팡 상품 매핑 테이블
    const productMapping: Record<string, string> = {
      '계란': 'prod-whole-egg-1',
      '당근': 'prod-carrot-1',
      '알배기배추': 'prod-cabbage-1',
      '아보카도': 'prod-avocado-1',
      '훈제연어': 'prod-salmon-1',
      // 더 많은 매핑 추가 가능
    };
    
    const productId = productMapping[ingredientName];
    if (productId) {
      return mockProducts.find(p => p.id === productId) || null;
    }
    
    // 부분 매치 로직
    const partialMatch = mockProducts.find(product => 
      product.name.includes(ingredientName) || 
      ingredientName.includes(product.name.split(' ')[0])
    );
    
    return partialMatch || null;
  }
  
  matchIngredients(ingredients: Array<{name: string; quantity: number; unit: string}>): RecipeIngredient[] {
    return ingredients.map(ingredient => {
      const product = this.findMatchingProduct(ingredient.name);
      
      return {
        product: product || this.createFallbackProduct(ingredient.name),
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        isOptional: false
      };
    });
  }
  
  private createFallbackProduct(ingredientName: string): CoupangProduct {
    // 매칭되지 않는 재료에 대한 기본 상품 생성
    return {
      id: `fallback-${ingredientName}`,
      name: `${ingredientName} (쿠팡)`,
      price: 3000, // 기본 가격
      imageUrl: 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(ingredientName),
      coupangUrl: 'https://www.coupang.com/search?q=' + encodeURIComponent(ingredientName),
      category: '식재료',
      nutrition: { calories: 50, carb: 10, protein: 2, fat: 1, sodium: 100, sugar: 0 },
      description: `${ingredientName} 상품`,
      brand: '일반',
      weight: '1개',
      rating: 4.0,
      reviewCount: 100,
      isRocketDelivery: false
    };
  }
}

// 🎯 메인 변환기 클래스
export class MankaeRecipeProcessor {
  private nutritionCalculator = new NutritionCalculator();
  private goalClassifier = new GoalClassifier();
  private productMatcher = new CoupangProductMatcher();
  
  // 재료 문자열 파싱 (실제 CSV 형식에 맞춘 완전 개선 버전)
  private parseIngredients(ingredientText: string): Array<{name: string; quantity: number; unit: string}> {
    const ingredients: Array<{name: string; quantity: number; unit: string}> = [];

    console.log(`🧪 재료 파싱 시작: "${ingredientText.substring(0, 100)}..."`);

    if (!ingredientText || ingredientText.trim() === '') {
      console.log(`⚠️ 재료 텍스트가 비어있음`);
      return ingredients;
    }

    // 실제 CSV 형식 처리: "[재료] 떡국떡400g| 다진소고기100g| ..."
    const sections = ingredientText.split(/\[재료\]|\[양념\]|\[소스\]|\[육수\]|\[간장양념\]|\[양념장\]|\[얼갈이데칠때\]|\[만두전골 육수\]|\[전골요리 양념장\]/);

    sections.forEach((section, sectionIndex) => {
      if (!section.trim()) return;

      console.log(`🔍 섹션 ${sectionIndex}: "${section.substring(0, 50)}..."`);

      const items = section.split('|').filter(item => item.trim());
      console.log(`📝 아이템 개수: ${items.length}`);

      items.forEach((item, itemIndex) => {
        const trimmed = item.trim();
        if (!trimmed || trimmed === '약간' || trimmed.length < 2) return;

        console.log(`🔍 아이템 ${itemIndex}: "${trimmed}"`);

        let match = null;

        // 🔥 실제 CSV 데이터 패턴에 완벽하게 맞춘 정규식들

        // 1. "돼지고기수육용삼겹살500g" 형태 (공백 없는 긴 이름 + 숫자 + 한글단위)
        match = trimmed.match(/^(.+[가-힣])(\d+(?:\/\d+)?(?:\.\d+)?)([가-힣]+)$/);

        // 2. "멸치육수800ml" 형태 (공백 없는 이름 + 숫자 + 영어단위)
        if (!match) {
          match = trimmed.match(/^(.+[가-힣])(\d+(?:\/\d+)?(?:\.\d+)?)([a-zA-Z]+)$/);
        }

        // 3. "돼지고기 수육용삼겹살500g" 형태 (공백 포함 긴 이름 + 숫자 + 한글단위)
        if (!match) {
          match = trimmed.match(/^(.+?)\s+(\d+(?:\/\d+)?(?:\.\d+)?)([가-힣]+)$/);
        }

        // 4. "된장1.5큰술" 형태 (소수점 + 한글단위)
        if (!match) {
          match = trimmed.match(/^(.+?)(\d+(?:\.\d+)?)([가-힣]+)$/);
        }

        // 5. "대파1/3대" 형태 (분수 + 한글단위)
        if (!match) {
          match = trimmed.match(/^(.+?)(\d+\/\d+)([가-힣]+)$/);
        }

        // 6. "참기름1T" 형태 (영어 단위)
        if (!match) {
          match = trimmed.match(/^(.+?)(\d+(?:\/\d+)?(?:\.\d+)?)([TtLl])$/);
        }

        // 7. "소금" 형태 (이름만, 수량 1로 설정)
        if (!match && trimmed.length > 1 && !trimmed.includes('약간')) {
          match = [trimmed, trimmed, '1', '개'];
        }

        if (match) {
          const [, name, quantityStr, unit] = match;
          let quantity = parseFloat(quantityStr);

          // 분수 처리 (1/3 → 0.333)
          if (quantityStr.includes('/')) {
            const [numerator, denominator] = quantityStr.split('/').map(Number);
            quantity = numerator / denominator;
          }

          const ingredient = {
            name: name.trim(),
            quantity,
            unit: unit.trim()
          };

          ingredients.push(ingredient);
          console.log(`✅ 재료 추가: ${ingredient.name} ${ingredient.quantity}${ingredient.unit}`);
        } else {
          console.log(`❌ 매칭 실패: "${trimmed}"`);

          // 실패한 경우라도 유효한 재료명 추출 시도
          // 숫자와 단위를 제외한 나머지를 재료명으로 간주
          const nameOnlyMatch = trimmed.match(/^(.+?)(?:\d|\s*$)/);
          if (nameOnlyMatch && nameOnlyMatch[1].trim().length > 1 &&
              !trimmed.includes('약간') && !trimmed.includes('적당히')) {

            const fallbackIngredient = {
              name: nameOnlyMatch[1].trim(),
              quantity: 1,
              unit: '개'
            };
            ingredients.push(fallbackIngredient);
            console.log(`🔄 폴백 재료 추가: ${fallbackIngredient.name} ${fallbackIngredient.quantity}${fallbackIngredient.unit}`);
          }
        }
      });
    });

    console.log(`📋 최종 재료 개수: ${ingredients.length}`);
    return ingredients;
  }
  
  // 조리시간 변환
  private parseTime(timeStr: string): number {
    // null/undefined 체크 추가
    if (!timeStr || typeof timeStr !== 'string') {
      console.log('⚠️ 조리시간 정보가 없음, 기본값 30분 사용');
      return 30; // 기본값 30분
    }

    if (timeStr.includes('시간')) {
      const hours = parseInt(timeStr) || 1;
      return hours * 60;
    }

    const minutes = parseInt(timeStr) || 15;
    return minutes;
  }

  // 🧪 파싱 함수 테스트 (임시 디버깅용)
  testParseIngredients(ingredientText: string): Array<{name: string; quantity: number; unit: string}> {
    console.log('🧪 파싱 테스트 시작:', ingredientText);
    return this.parseIngredients(ingredientText);
  }

  // 🔥 긴급 디버깅: 실제 CSV 데이터로 테스트
  debugRealDataParsing() {
    const testData = [
      "[재료] 떡국떡400g| 다진소고기100g| 멸치육수800ml| 대파1/3대| 계란2개| 참기름1T| 국간장1T",
      "[재료] 돼지고기 수육용삼겹살500g| 된장1.5큰술| 술4큰술| 홍어무침| 무생채| 콩나물무침",
      "[재료] 배추3장| 양파1/2개| 대파1대| 청양고추2개"
    ];

    testData.forEach((data, index) => {
      console.log(`\n🧪 테스트 ${index + 1}: ${data}`);
      const result = this.parseIngredients(data);
      console.log(`📋 결과: ${result.length}개 재료 파싱됨`);
      result.forEach((ing, i) => {
        console.log(`   ${i + 1}. ${ing.name}: ${ing.quantity}${ing.unit}`);
      });
    });
  }
  
  // 인분수 변환
  private parseServings(servingStr: string): number {
    if (!servingStr || typeof servingStr !== 'string') {
      return 2; // 기본값 2인분
    }
    const match = servingStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 2;
  }
  
  // 난이도 변환
  private parseDifficulty(difficultyStr: string): 'easy' | 'medium' | 'hard' {
    // null/undefined 체크 추가
    if (!difficultyStr || typeof difficultyStr !== 'string') {
      console.log('⚠️ 난이도 정보가 없음, 기본값 medium 사용');
      return 'medium'; // 기본값 medium
    }

    if (difficultyStr.includes('초급') || difficultyStr.includes('아무나')) return 'easy';
    if (difficultyStr.includes('중급')) return 'medium';
    return 'hard';
  }
  
  // 식사 타입 추론
  private inferMealType(
    title: string, 
    category: string, 
    mealPurpose: string
  ): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    // null/undefined 체크
    const safeTitle = title || '';
    const safeCategory = category || '';
    const safeMealPurpose = mealPurpose || '';
    
    const titleLower = safeTitle.toLowerCase();
    
    if (titleLower.includes('아침') || safeMealPurpose === '아침대용') return 'breakfast';
    if (titleLower.includes('점심')) return 'lunch';
    if (titleLower.includes('저녁') || safeMealPurpose === '술안주') return 'dinner';
    if (safeCategory === '양념/소스/잼' || safeMealPurpose === '간식') return 'snack';
    
    // 기본값: 요리 종류에 따라 결정
    if (safeCategory === '국/탕') return 'dinner';
    if (safeCategory === '밑반찬') return 'lunch';
    
    return 'lunch'; // 기본값
  }
  
  // 품질 점수 계산
  private calculateQualityScore(views: number, scraps: number): {
    overall: number; taste: number; difficulty: number; nutrition: number; reviewCount: number;
  } {
    // 조회수 기반 점수 (최대 5.0)
    const viewScore = Math.min((views / 200) * 5, 5.0);
    
    // 스크랩율 기반 점수 (최대 5.0)
    const engagementRate = views > 0 ? (scraps / views) * 100 : 0;
    const engagementScore = Math.min(engagementRate * 50, 5.0);
    
    // 전체 점수 (조회수 70% + 스크랩율 30%)
    const overall = (viewScore * 0.7 + engagementScore * 0.3);
    
    return {
      overall: Math.round(overall * 10) / 10,
      taste: Math.min(overall + 0.2, 5.0),
      difficulty: Math.min(overall + 0.1, 5.0),
      nutrition: Math.min(overall - 0.1, 5.0),
      reviewCount: views
    };
  }
  
  // 🎯 메인 변환 함수 (성능 최적화)
  processRecipe(rawData: MankaeLRecipeRaw): Recipe {
    // 🔥 긴급 디버깅: 모든 레시피 처리 과정 추적
    console.log(`🔄 레시피 처리 시작: ${rawData.RCP_TTL}`);
    console.log(`   - 원본 재료 데이터: "${rawData.CKG_MTRL_CN?.substring(0, 100)}..."`);

    // 1단계: 재료 파싱
    const ingredients = this.parseIngredients(rawData.CKG_MTRL_CN || '');
    console.log(`   - 파싱된 재료 수: ${ingredients.length}개`);

    if (ingredients.length > 0) {
      console.log(`   - 샘플 재료: ${ingredients.slice(0, 3).map(i => `${i.name}(${i.quantity}${i.unit})`).join(', ')}`);
    }

    // 2단계: 영양소 계산 (캐시 활용)
    const nutrition = this.nutritionCalculator.calculateNutrition(ingredients);
    console.log(`   - 계산된 영양소: ${nutrition.calories}kcal, ${nutrition.protein}g 단백질`);

    // 3단계: 목표 분류 (최적화된 알고리즘)
    const goalFit = this.goalClassifier.classifyRecipeGoals(
      ingredients,
      rawData.CKG_MTH_ACTO_NM || '',
      rawData.CKG_STA_ACTO_NM || '',
      rawData.CKG_IPDC || '',
      nutrition
    );

    console.log(`   - 분류된 목표: [${goalFit.join(', ')}]`);
    console.log('---');

    // 4단계: 품질 평가
    const userRatings = this.calculateQualityScore(rawData.INQ_CNT || 0, rawData.SRAP_CNT || 0);

    // 5단계: Recipe 객체 생성
    const recipe: Recipe = {
      id: `mankae-${rawData.RCP_SNO}`,
      name: rawData.CKG_NM || '제목 없음',
      description: rawData.CKG_IPDC || '설명 없음',
      image: rawData.RCP_IMG_URL || `https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3`, // 실제 이미지 또는 기본 이미지
      cookingTime: this.parseTime(rawData.CKG_TIME_NM || ''),
      difficulty: this.parseDifficulty(rawData.CKG_DODF_NM || ''),
      instructions: this.generateInstructions(rawData.CKG_MTH_ACTO_NM || '', ingredients),
      tags: this.generateTags(rawData, nutrition),
      mealType: this.inferMealType(rawData.RCP_TTL || '', rawData.CKG_KND_ACTO_NM || '', rawData.CKG_STA_ACTO_NM || ''),
      goalFit,
      
      // 확장 정보 (선택적)
      nutritionHighlights: {
        mainBenefits: this.generateNutritionBenefits(ingredients, nutrition),
        calorieContext: `${nutrition.calories}kcal로 균형잡힌 한 끼`,
        dietaryInfo: this.generateDietaryInfo(ingredients, nutrition)
      },
      
      userRatings,
      
      sourceInfo: {
        chef: rawData.RGTR_NM || '알 수 없음',
        source: 'chef_recipe',
        verified: (rawData.INQ_CNT || 0) > 100, // 조회수 100 이상이면 검증된 것으로 간주
        lastUpdated: (rawData.FIRST_REG_DT || '20240101').substring(0, 8) // YYYYMMDD 형식
      }
    };
    
    console.log(`✅ 변환 완료: ${recipe.name}`);
    return recipe;
  }
  
  // 조리법 생성
  private generateInstructions(cookingMethod: string, ingredients: Array<{name: string; quantity: number; unit: string}>): string[] {
    const baseInstructions: Record<string, string[]> = {
      '부침': [
        '팬에 기름을 두르고 중약불로 달궈주세요',
        '재료를 올리고 노릇하게 부쳐주세요',
        '뒤집어서 반대면도 익혀주세요',
        '완성된 요리를 접시에 담아주세요'
      ],
      '볶음': [
        '팬을 달구고 기름을 두르세요',
        '재료를 넣고 센 불에서 빠르게 볶아주세요',
        '양념을 넣고 골고루 섞어주세요',
        '불을 끄고 접시에 담아 완성하세요'
      ],
      '찜': [
        '재료를 깨끗이 손질하여 준비하세요',
        '찜기에 물을 넣고 끓여주세요',
        '재료를 찜기에 올리고 뚜껑을 덮어주세요',
        '충분히 익으면 양념과 함께 완성하세요'
      ],
      '끓이기': [
        '냄비에 물을 넣고 끓여주세요',
        '재료를 넣고 중불에서 끓여주세요',
        '간을 맞추고 더 끓여주세요',
        '그릇에 담아 뜨겁게 완성하세요'
      ]
    };
    
    return baseInstructions[cookingMethod] || [
      '재료를 준비하고 손질하세요',
      '적절한 방법으로 조리하세요',
      '간을 맞추고 완성하세요'
    ];
  }
  
  // 태그 생성
  private generateTags(rawData: MankaeLRecipeRaw, nutrition: {calories: number; protein: number}): string[] {
    const tags: string[] = [];
    
    // 조리법 기반 - null 체크
    if (rawData.CKG_MTH_ACTO_NM) {
      tags.push(rawData.CKG_MTH_ACTO_NM);
    }
    
    // 영양 기반
    if (nutrition.protein > 15) tags.push('고단백');
    if (nutrition.calories < 200) tags.push('저칼로리');
    
    // 상황 기반 - null 체크
    if (rawData.CKG_STA_ACTO_NM === '초스피드') tags.push('간편');
    if (rawData.CKG_DODF_NM === '아무나') tags.push('초보자');
    
    // 시간 기반 - null 체크
    if (rawData.CKG_TIME_NM && rawData.CKG_TIME_NM.includes('10분')) tags.push('10분완성');
    if (rawData.CKG_TIME_NM && rawData.CKG_TIME_NM.includes('15분')) tags.push('15분완성');
    
    return tags;
  }
  
  // 영양 혜택 생성
  private generateNutritionBenefits(
    ingredients: Array<{name: string}>, 
    nutrition: {protein: number; calories: number}
  ): string[] {
    const benefits: string[] = [];
    
    if (nutrition.protein > 15) {
      benefits.push(`고단백질(${nutrition.protein}g)로 근육 건강에 도움`);
    }
    
    ingredients.forEach(ing => {
      if (ing.name === '계란') benefits.push('완전단백질과 비타민 공급');
      if (ing.name === '배추') benefits.push('식이섬유와 비타민C 풍부');
      if (ing.name === '아보카도') benefits.push('건강한 불포화지방산 함유');
    });
    
    return benefits;
  }
  
  // 식단 정보 생성
  private generateDietaryInfo(
    ingredients: Array<{name: string}>, 
    nutrition: {calories: number; protein: number}
  ): ('글루텐프리' | '저탄수화물' | '고단백' | '저지방' | '비건' | '케토' | '저칼로리')[] {
    const info: ('글루텐프리' | '저탄수화물' | '고단백' | '저지방' | '비건' | '케토' | '저칼로리')[] = [];
    
    if (nutrition.protein > 15) info.push('고단백');
    if (nutrition.calories < 200) info.push('저칼로리');
    
    const hasAnimalProducts = ingredients.some(ing => 
      ['계란', '우삼겹', '훈제연어'].includes(ing.name)
    );
    if (!hasAnimalProducts) info.push('비건');
    
    return info;
  }
}
