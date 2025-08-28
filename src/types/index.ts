// 영양소 비율 인터페이스
export interface NutrientRatios {
  carb: number;
  protein: number;
  fat: number;
}

// 사용자 프로필 인터페이스
export interface UserProfile {
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  age: number;
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  budget: number; // 일주일 식비 예산 (원)
}

// 칼로리 및 영양소 계산 결과
export interface CalorieCalculation {
  bmr: number; // 기초대사율
  tdee: number; // 총 일일 에너지 소모량
  targetCalories: number; // 목적에 따른 목표 칼로리
  macros: NutrientRatios; // 자동 계산된 영양소 비율
}

// 온보딩 단계 (MVP 간소화: 3단계)
export type OnboardingStep = 'goal' | 'budget' | 'basic_info' | 'complete';

// 영양성분 정보
export interface NutritionInfo {
  calories: number;
  carb: number;
  protein: number;
  fat: number;
  sodium: number;
  sugar: number;
}

// 쿠팡 상품 인터페이스
export interface CoupangProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  coupangUrl: string;
  category: string;
  nutrition: NutritionInfo;
  description: string;
  brand: string;
  weight: string;
  rating: number;
  reviewCount: number;
  isRocketDelivery: boolean;
}

// 🍳 레시피 인터페이스 (확장됨)
export interface Recipe {
  id: string;
  name: string; // "새우 토마토 파스타"
  description: string; // "신선한 새우와 토마토로 만든 건강한 파스타"
  image: string; // 완성된 요리 이미지
  cookingTime: number; // 조리 시간 (분)
  difficulty: 'easy' | 'medium' | 'hard'; // 난이도
  instructions: string[]; // 조리법 단계
  tags: string[]; // ["고단백", "저칼로리", "다이어트"]
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  goalFit: ('weight_loss' | 'muscle_gain' | 'maintenance')[]; // 어떤 목표에 적합한지
  
  // 🌟 맛있는 레시피 정보 확장 (모두 선택적)
  flavorProfile?: {
    taste: ('단맛' | '짠맛' | '신맛' | '쓴맛' | '매운맛' | '감칠맛')[];
    intensity: 'light' | 'medium' | 'strong'; // 맛의 강도
    description: string; // "깔끔하고 담백한 맛"
  };
  
  cookingTips?: {
    prep: string[]; // 준비 단계 팁
    cooking: string[]; // 조리 단계 팁  
    presentation: string[]; // 플레이팅 팁
    storage: string; // 보관법
  };
  
  nutritionHighlights?: {
    mainBenefits: string[]; // ["고단백질로 근육 합성 도움", "비타민C 풍부"]
    calorieContext: string; // "일반 파스타보다 40% 적은 칼로리"
    dietaryInfo: ('글루텐프리' | '저탄수화물' | '고단백' | '저지방' | '비건' | '케토' | '저칼로리')[];
  };
  
  equipmentNeeded?: string[]; // ["팬", "도마", "칼", "체"]
  
  variations?: {
    name: string;
    description: string;
    modification: string; // "브로콜리 대신 아스파라거스 사용"
  }[];
  
  chefTips?: string[]; // 전문가 팁
  
  userRatings?: {
    overall: number; // 전체 평점 (1-5)
    taste: number; // 맛 평점
    difficulty: number; // 난이도 적절성
    nutrition: number; // 영양 만족도
    reviewCount: number;
  };
  
  sourceInfo?: {
    chef?: string; // "백종원", "이연복"
    source: 'ai_generated' | 'chef_recipe' | 'user_submitted' | 'nutrition_optimized';
    verified: boolean; // 영양사 검증 여부
    lastUpdated: string; // "2024-03-15"
  };
}

// 🛒 레시피 재료 (쿠팡 상품 연결)
export interface RecipeIngredient {
  product: CoupangProduct;
  quantity: number; // 필요한 수량
  unit: string; // "개", "g", "ml"
  isOptional: boolean; // 선택 재료 여부
  substitutes?: CoupangProduct[]; // 대체 가능한 상품들
}

// 🍽️ 완전한 식단 추천 (레시피 기반)
export interface RecommendedMeal {
  id: string;
  recipe: Recipe;
  ingredients: RecipeIngredient[];
  totalPrice: number;
  totalNutrition: NutritionInfo;
  servings: number;
  estimatedPrepTime: number; // 예상 준비 시간
}

// 입력 데이터 인터페이스
export interface UserInput {
  budget: number;
  nutrients: NutrientRatios;
}

// 사용자 통찰 정보
export interface UserInsights {
  dailyCalorieGoal: number;
  proteinNeeds: number;
  budgetPerMeal: number;
  goalProgress: {
    message: string;
    percentage: number;
    nextMilestone: string;
  };
}

// 개인화된 영양 목표
export interface PersonalizedNutritionTargets {
  targetCalories: number;
  dailyProteinNeeds: number;
  macroPercentages: {
    protein: number;
    fat: number;
    carb: number;
  };
  macroGrams: {
    protein: number;
    fat: number;
    carb: number;
  };
}

// 추천 결과 인터페이스 (개선됨)
export interface RecommendationResult {
  meals: RecommendedMeal[];
  totalBudgetUsed: number;
  budgetRemaining: number;
  nutritionBalance: {
    carb: number;
    protein: number;
    fat: number;
  };
  message?: string; // 개인맞춤 추천 메시지
  nutritionTargets?: PersonalizedNutritionTargets; // 개인 영양 목표
  recommendedRecipes?: Recipe[]; // 추천 레시피
  userInsights?: UserInsights; // 사용자 통찰
}
