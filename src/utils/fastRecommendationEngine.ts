// ⚡ 초고속 추천 엔진 (메모이제이션 + 인덱싱 + 캐싱)
import { Recipe, UserProfile, CalorieCalculation } from '../types';
import { getRecipesByGoal } from '../data/recipeData';

interface FastCacheEntry {
  data: any;
  timestamp: number;
  hash: string;
}

interface NutritionCache {
  [recipeId: string]: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    monthlyCost: number;
  };
}

interface RecipeCombinationCache {
  [hash: string]: {
    recipes: Recipe[];
    totalCost: number;
    nutritionScore: number;
  };
}

export class FastRecommendationEngine {
  private static instance: FastRecommendationEngine;
  private nutritionCache: NutritionCache = {};
  private combinationCache: RecipeCombinationCache = {};
  private fastCache = new Map<string, FastCacheEntry>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10분

  private constructor() {}

  static getInstance(): FastRecommendationEngine {
    if (!FastRecommendationEngine.instance) {
      FastRecommendationEngine.instance = new FastRecommendationEngine();
    }
    return FastRecommendationEngine.instance;
  }

  // 🚀 초고속 추천 생성 (메인 함수)
  async generateFastRecommendations(
    userProfile: UserProfile,
    calorieCalculation: CalorieCalculation,
    monthlyBudget: number
  ): Promise<{
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
  }> {
    const startTime = performance.now();
    
    // 캐시 키 생성
    const cacheKey = this.generateCacheKey(userProfile, calorieCalculation, monthlyBudget);
    
    // 캐시 확인 (디버깅 추가)
    const cached = this.getValidCache(cacheKey);
    if (cached) {
      console.log('⚡ 초고속 캐시 히트! 즉시 반환');
      console.log('📊 캐시된 레시피 수:', cached.data.recommendedRecipes?.length || 0);
      
      // 빈 배열이면 캐시 무효화
      if (!cached.data.recommendedRecipes || cached.data.recommendedRecipes.length === 0) {
        console.log('⚠️ 빈 캐시 감지! 캐시 삭제 후 새로 생성');
        this.fastCache.delete(cacheKey);
      } else {
        return cached.data;
      }
    }

    console.log('🚀 초고속 추천 엔진 시작...');

    // 1단계: 목표 레시피 가져오기 (에러 처리를 위해 try 밖에서 선언)
    let goalRecipes: Recipe[] = [];
    
    try {
      goalRecipes = await getRecipesByGoal(userProfile.goal || 'maintenance');
      console.log('📋 1단계: 목표 레시피 로드 완료:', goalRecipes.length + '개');
      
      if (goalRecipes.length === 0) {
        console.log('⚠️ 목표 레시피가 없음! 폴백 모드로 전환');
        return this.generateSimpleFallback([], monthlyBudget);
      }
      
      // 2단계: 고속 전처리 (영양소 + 비용)
      const preprocessedRecipes = await this.fastPreprocessRecipes(goalRecipes);
      console.log('📋 2단계: 전처리 완료:', preprocessedRecipes.length + '개');
      
      // 3단계: 예산 기반 빠른 필터링
      const affordableRecipes = this.fastBudgetFilter(preprocessedRecipes, monthlyBudget);
      console.log('📋 3단계: 예산 필터링 완료:', affordableRecipes.length + '개');
      
      // 4단계: 초고속 조합 찾기 (휴리스틱 알고리즘)
      const optimalRecipes = this.findOptimalCombinationFast(
        affordableRecipes, 
        monthlyBudget,
        calorieCalculation
      );
      console.log('📋 4단계: 최적 조합 선택 완료:', optimalRecipes.length + '개');

      // 5단계: 예산 분석
      const budgetAnalysis = this.generateBudgetAnalysis(optimalRecipes, monthlyBudget);

      const result = {
        recommendedRecipes: optimalRecipes,
        budgetAnalysis
      };

      // 결과 캐싱
      this.setCache(cacheKey, result);

      const endTime = performance.now();
      console.log(`✅ 초고속 추천 완료: ${Math.round(endTime - startTime)}ms`);
      
      return result;

    } catch (error) {
      console.error('❌ 초고속 추천 실패:', error);
      
      // 🔄 단순 폴백 (가장 빠른 방식)
      return this.generateSimpleFallback(goalRecipes, monthlyBudget);
    }
  }

  // 🔥 고속 전처리 (배치 처리 + 메모이제이션)
  private async fastPreprocessRecipes(recipes: Recipe[]): Promise<Array<{
    recipe: Recipe;
    nutrition: { calories: number; protein: number; carbs: number; fat: number };
    monthlyCost: number;
    score: number;
  }>> {
    const processed = [];
    
    for (const recipe of recipes) {
      // 캐시된 영양소 정보 확인
      let nutrition = this.nutritionCache[recipe.id];
      if (!nutrition) {
        // 간단한 추정치 사용 (실제 계산 대신)
        nutrition = this.estimateNutrition(recipe);
        this.nutritionCache[recipe.id] = nutrition;
      }

      processed.push({
        recipe,
        nutrition,
        monthlyCost: nutrition.monthlyCost,
        score: this.calculateSimpleScore(recipe, nutrition)
      });
    }

    return processed;
  }

  // ⚡ 간단한 영양소 추정 (복잡한 계산 대신)
  private estimateNutrition(recipe: Recipe): {
    calories: number; protein: number; carbs: number; fat: number; monthlyCost: number;
  } {
    // 레시피 이름과 태그 기반 빠른 추정
    const name = recipe.name.toLowerCase();
    const tags = recipe.tags?.join(' ').toLowerCase() || '';
    
    let calories = 400; // 기본값
    let protein = 20;
    let carbs = 50;
    let fat = 15;
    let monthlyCost = 45000; // 기본 월 비용

    // 키워드 기반 빠른 조정
    if (name.includes('닭') || name.includes('계란') || tags.includes('고단백')) {
      protein += 15;
      calories += 50;
      monthlyCost += 15000;
    }
    
    if (name.includes('샐러드') || name.includes('야채') || tags.includes('저칼로리')) {
      calories -= 150;
      carbs -= 20;
      monthlyCost -= 10000;
    }
    
    if (name.includes('밥') || name.includes('면') || name.includes('파스타')) {
      carbs += 30;
      calories += 100;
    }

    if (name.includes('등심') || name.includes('소고기')) {
      protein += 20;
      fat += 10;
      calories += 100;
      monthlyCost += 25000;
    }

    return { calories, protein, carbs, fat, monthlyCost };
  }

  // ⚡ 간단한 점수 계산
  private calculateSimpleScore(recipe: Recipe, nutrition: any): number {
    const viewScore = Math.min((recipe.userRatings?.overall || 0) * 20, 100);
    const nutritionScore = Math.min(nutrition.protein * 2 + nutrition.calories * 0.1, 100);
    const costScore = Math.max(100 - (nutrition.monthlyCost / 1000), 0);
    
    return (viewScore * 0.4 + nutritionScore * 0.4 + costScore * 0.2);
  }

  // ⚡ 예산 기반 빠른 필터링
  private fastBudgetFilter(
    recipes: Array<{ recipe: Recipe; nutrition: any; monthlyCost: number; score: number }>,
    monthlyBudget: number
  ) {
    const maxCostPerRecipe = monthlyBudget * 0.6; // 한 레시피가 예산의 60% 이하
    
    return recipes
      .filter(item => item.monthlyCost <= maxCostPerRecipe)
      .sort((a, b) => b.score - a.score) // 점수순 정렬
      .slice(0, 20); // 상위 20개만 처리
  }

  // 🚀 초고속 조합 찾기 (휴리스틱 알고리즘)
  private findOptimalCombinationFast(
    affordableRecipes: Array<{ recipe: Recipe; nutrition: any; monthlyCost: number; score: number }>,
    monthlyBudget: number,
    calorieCalculation: CalorieCalculation
  ): Recipe[] {
    console.log('🔍 조합 찾기 시작:', {
      available: affordableRecipes.length,
      budget: monthlyBudget
    });

    if (affordableRecipes.length === 0) {
      console.log('⚠️ 사용 가능한 레시피가 없음');
      return [];
    }

    // 🔥 휴리스틱: 가격-성능비 기반 그리디 알고리즘
    let remainingBudget = monthlyBudget;
    const selectedRecipes: Recipe[] = [];

    // 가격 대비 점수 기준으로 재정렬
    const costEffectiveRecipes = affordableRecipes
      .map(item => ({
        ...item,
        efficiency: item.monthlyCost > 0 ? (item.score / (item.monthlyCost / 10000)) : item.score // 0으로 나누기 방지
      }))
      .sort((a, b) => b.efficiency - a.efficiency);

    console.log('💰 가격-성능비 상위 5개:', costEffectiveRecipes.slice(0, 5).map(item => ({
      name: item.recipe.name,
      cost: item.monthlyCost,
      score: item.score,
      efficiency: item.efficiency
    })));

    // 그리디 선택 (최대 3개)
    for (const item of costEffectiveRecipes) {
      if (selectedRecipes.length >= 3) break;
      
      const canAfford = item.monthlyCost <= remainingBudget * 0.9; // 90% 예산 사용
      console.log(`🔍 검토: ${item.recipe.name} (비용: ${item.monthlyCost}, 예산여유: ${remainingBudget}, 가능: ${canAfford})`);
      
      if (canAfford) {
        selectedRecipes.push(item.recipe);
        remainingBudget -= item.monthlyCost;
        console.log(`✅ 선택: ${item.recipe.name}`);
      }
    }

    // 예산 제한이 너무 엄격하면 완화
    if (selectedRecipes.length === 0) {
      console.log('⚠️ 예산 조건 완화해서 재시도');
      for (const item of costEffectiveRecipes.slice(0, 3)) {
        selectedRecipes.push(item.recipe);
        if (selectedRecipes.length >= 3) break;
      }
    }

    // 최소 1개는 선택 보장
    if (selectedRecipes.length === 0 && affordableRecipes.length > 0) {
      selectedRecipes.push(affordableRecipes[0].recipe);
      console.log('🛡️ 최소 1개 보장:', affordableRecipes[0].recipe.name);
    }

    console.log(`⚡ 고속 조합 완료: ${selectedRecipes.length}개 레시피 선택`);
    return selectedRecipes;
  }

  // 📊 예산 분석 생성
  private generateBudgetAnalysis(recipes: Recipe[], monthlyBudget: number) {
    const costBreakdown = recipes.map(recipe => {
      const nutrition = this.nutritionCache[recipe.id];
      const monthlyCost = nutrition?.monthlyCost || 45000;
      
      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        monthlyCost,
        costPercentage: (monthlyCost / monthlyBudget) * 100
      };
    });

    const totalEstimatedCost = costBreakdown.reduce((sum, item) => sum + item.monthlyCost, 0);
    const budgetUsagePercentage = (totalEstimatedCost / monthlyBudget) * 100;

    return {
      totalEstimatedCost,
      budgetUsagePercentage,
      costBreakdown
    };
  }

  // 🔄 단순 폴백 (최후 수단)
  private async generateSimpleFallback(recipes: Recipe[], monthlyBudget: number) {
    console.log('⚠️ 단순 폴백 모드');
    
    let fallbackRecipes: Recipe[] = [];
    
    if (recipes.length > 0) {
      // 레시피가 있으면 인기순으로 선택
      fallbackRecipes = recipes
        .sort((a, b) => (b.userRatings?.overall || 0) - (a.userRatings?.overall || 0))
        .slice(0, 3);
    } else {
      // 레시피가 없으면 기본 더미 레시피 생성
      console.log('📋 더미 레시피 생성');
      fallbackRecipes = [
        {
          id: 'fallback-breakfast',
          name: '추천 아침 레시피',
          description: '균형잡힌 아침 식사를 위한 추천 레시피',
          image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400',
          cookingTime: 15,
          difficulty: 'easy' as any,
          instructions: ['재료 준비', '조리하기', '완성'],
          tags: ['건강', '간편'],
          mealType: 'breakfast' as any,
          goalFit: ['maintenance'] as any,
          userRatings: { overall: 4.0, taste: 4.0, difficulty: 4.0, nutrition: 4.0, reviewCount: 100 }
        },
        {
          id: 'fallback-lunch',
          name: '추천 점심 레시피',
          description: '든든한 점심 식사를 위한 추천 레시피',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400',
          cookingTime: 20,
          difficulty: 'easy' as any,
          instructions: ['재료 준비', '조리하기', '완성'],
          tags: ['건강', '균형'],
          mealType: 'lunch' as any,
          goalFit: ['maintenance'] as any,
          userRatings: { overall: 4.0, taste: 4.0, difficulty: 4.0, nutrition: 4.0, reviewCount: 100 }
        },
        {
          id: 'fallback-dinner',
          name: '추천 저녁 레시피',
          description: '건강한 저녁 식사를 위한 추천 레시피',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=400',
          cookingTime: 25,
          difficulty: 'easy' as any,
          instructions: ['재료 준비', '조리하기', '완성'],
          tags: ['건강', '영양'],
          mealType: 'dinner' as any,
          goalFit: ['maintenance'] as any,
          userRatings: { overall: 4.0, taste: 4.0, difficulty: 4.0, nutrition: 4.0, reviewCount: 100 }
        }
      ];
    }

    const estimatedCostPerRecipe = Math.round(monthlyBudget / Math.max(fallbackRecipes.length, 1));
    
    console.log('📋 폴백 레시피 생성 완료:', fallbackRecipes.length + '개');
    
    return {
      recommendedRecipes: fallbackRecipes,
      budgetAnalysis: {
        totalEstimatedCost: monthlyBudget,
        budgetUsagePercentage: 100,
        costBreakdown: fallbackRecipes.map(recipe => ({
          recipeId: recipe.id,
          recipeName: recipe.name,
          monthlyCost: estimatedCostPerRecipe,
          costPercentage: Math.round(100 / fallbackRecipes.length)
        }))
      }
    };
  }

  // 🔧 유틸리티 메소드들
  private generateCacheKey(userProfile: UserProfile, calorieCalculation: CalorieCalculation, budget: number): string {
    return `${userProfile.goal}_${Math.round(calorieCalculation.tdee)}_${budget}`;
  }

  private getValidCache(key: string): FastCacheEntry | null {
    const cached = this.fastCache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.fastCache.delete(key);
      return null;
    }
    
    return cached;
  }

  private setCache(key: string, data: any): void {
    this.fastCache.set(key, {
      data,
      timestamp: Date.now(),
      hash: key
    });
  }

  // 🧹 캐시 관리
  clearCache(): void {
    this.fastCache.clear();
    this.nutritionCache = {};
    this.combinationCache = {};
    console.log('🧹 초고속 엔진 캐시 클리어 완료');
  }

  // 📊 성능 통계
  getStats(): { cacheSize: number; nutritionCacheSize: number; hitRate: number } {
    return {
      cacheSize: this.fastCache.size,
      nutritionCacheSize: Object.keys(this.nutritionCache).length,
      hitRate: 0 // 실제로는 히트율 계산
    };
  }
}

// 싱글톤 인스턴스
export const fastRecommendationEngine = FastRecommendationEngine.getInstance();
