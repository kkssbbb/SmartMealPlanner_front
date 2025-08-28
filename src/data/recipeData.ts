import { Recipe, RecipeIngredient } from '../types';
import { MankaeRecipeProcessor } from '../utils/recipeDataProcessor';
import { csvProcessor } from '../utils/csvProcessor';
import { optimizedCSVProcessor } from '../utils/optimizedCSVProcessor';
import { getRecipeIngredientsData } from './recipeIngredients';

// 🔥 실시간 만개의 레시피 데이터 로더
class RealTimeRecipeLoader {
  private static instance: RealTimeRecipeLoader;
  private processor = new MankaeRecipeProcessor();
  private cachedRecipes: Map<string, Recipe[]> = new Map();
  private isLoading = false;
  
  private constructor() {}
  
  static getInstance(): RealTimeRecipeLoader {
    if (!RealTimeRecipeLoader.instance) {
      RealTimeRecipeLoader.instance = new RealTimeRecipeLoader();
    }
    return RealTimeRecipeLoader.instance;
  }
  
  // 🎯 목표별 레시피 조회 (고성능 최적화)
  async getRecipesByGoal(goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): Promise<Recipe[]> {
    // 캐시 확인 (빈 배열 감지)
    if (this.cachedRecipes.has(goal)) {
      const cached = this.cachedRecipes.get(goal)!;
      console.log(`⚡ 캐시된 ${goal} 레시피: ${cached.length}개`);
      
      // 빈 캐시면 무효화
      if (cached.length === 0) {
        console.log('⚠️ 빈 캐시 감지! 삭제하고 재로드');
        this.cachedRecipes.delete(goal);
      } else {
        return cached;
      }
    }
    
    try {
      console.log(`🚀 ${goal} 고성능 레시피 로딩 시작...`);
      const startTime = performance.now();
      
      // 🔥 최적화된 프로세서 사용 (스트리밍 + 청크) - 더 많은 레시피 확보
      console.log(`📥 ${goal} 레시피 요청 시작 (최대 200개)`);
      const rawRecipes = await optimizedCSVProcessor.getRecipesByGoal(goal, 200);
      console.log(`📤 ${goal} 원본 레시피 수신: ${rawRecipes.length}개`);
      
      // 🔄 배치 처리로 변환 최적화
      const convertedRecipes: Recipe[] = [];
      const batchSize = 10;
      
      for (let i = 0; i < rawRecipes.length; i += batchSize) {
        const batch = rawRecipes.slice(i, i + batchSize);
        
        // 배치 단위로 병렬 처리
        const batchResults = await Promise.allSettled(
          batch.map(async (rawRecipe) => {
            try {
              const recipe = this.processor.processRecipe(rawRecipe);
              console.log(`🔧 처리 중인 레시피: ${rawRecipe.CKG_NM || rawRecipe.RCP_TTL}`);
              return recipe;
            } catch (error) {
              console.log(`❌ 레시피 처리 에러: ${rawRecipe.CKG_NM || rawRecipe.RCP_TTL}`, error);
              throw error; // null 대신 에러를 던져서 rejected 상태로 만듦
            }
          })
        );
        
        // 🔥 상세 디버깅: 변환 과정 전체 추적
        let batchSuccessCount = 0;
        let batchGoalMatchCount = 0;

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            const recipe = result.value;
            batchSuccessCount++;

            console.log(`🔄 레시피 변환 성공 ${i + index + 1}: ${recipe.name}`);
            console.log(`   - 목표 분류: [${recipe.goalFit?.join(', ') || '없음'}]`);
            console.log(`   - 목표 포함 여부: ${recipe.goalFit?.includes(goal) ? '✅ 포함' : '❌ 제외'}`);

            if (recipe.goalFit && recipe.goalFit.includes(goal)) {
              convertedRecipes.push(recipe);
              batchGoalMatchCount++;
              console.log(`✅ ${goal} 최종 매칭: ${recipe.name}`);
            }
           } else if (result.status === 'rejected') {
             console.log(`❌ 레시피 처리 실패 ${i + index + 1}:`, result.reason);
           } else if (result.status === 'fulfilled' && !result.value) {
             console.log(`⚠️ 레시피 처리 결과가 null ${i + index + 1}`);
           }
        });

        console.log(`📊 배치 결과: ${batchSuccessCount}개 처리, ${batchGoalMatchCount}개 ${goal} 매칭`);
        console.log(`📈 누적 결과: ${convertedRecipes.length}개 ${goal} 레시피`);
        
        // UI 응답성을 위한 마이크로 태스크
        if (i % (batchSize * 3) === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      // 품질 점수로 정렬
      const sortedRecipes = convertedRecipes.sort((a, b) => 
        (b.userRatings?.overall || 0) - (a.userRatings?.overall || 0)
      );
      
      // 캐시 저장
      this.cachedRecipes.set(goal, sortedRecipes);
      
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      console.log(`✅ ${goal} 레시피 ${sortedRecipes.length}개 고성능 로드 완료 (${loadTime}ms)`);
      
      return sortedRecipes;
      
    } catch (error) {
      console.error(`❌ ${goal} 레시피 로드 실패:`, error);
      
      // 🔄 폴백: 기존 방식
      console.log(`⚠️ ${goal} 폴백 모드로 전환`);
      return this.fallbackGetRecipesByGoal(goal);
    }
  }
  
  // 🔄 폴백 메소드 (기존 방식)
  private async fallbackGetRecipesByGoal(goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): Promise<Recipe[]> {
    const goalKeywords = {
      weight_loss: ['다이어트', '저칼로리', '살빼기'],
      muscle_gain: ['단백질', '근육', '고단백'],
      maintenance: ['건강', '균형', '일상']
    };
    
    console.log(`🔄 폴백 모드: ${goal} 레시피 로드 시작`);
    
    try {
      const rawRecipes = await csvProcessor.getRecipesByKeywords(goalKeywords[goal], 30);
      console.log(`📋 폴백: CSV에서 ${rawRecipes.length}개 레시피 찾음`);
      const convertedRecipes: Recipe[] = [];
      
      for (const rawRecipe of rawRecipes) {
        try {
          const recipe = this.processor.processRecipe(rawRecipe);
          if (recipe.goalFit.includes(goal)) {
            convertedRecipes.push(recipe);
          }
        } catch (error) {
          continue;
        }
      }
      
      return convertedRecipes.sort((a, b) => 
        (b.userRatings?.overall || 0) - (a.userRatings?.overall || 0)
      );
    } catch (error) {
      console.error(`❌ ${goal} 폴백 로드도 실패:`, error);
      return [];
    }
  }
  
  // 🔥 인기 레시피 조회
  async getPopularRecipes(limit: number = 30): Promise<Recipe[]> {
    const cacheKey = `popular_${limit}`;
    
    if (this.cachedRecipes.has(cacheKey)) {
      return this.cachedRecipes.get(cacheKey)!;
    }
    
    try {
      const rawRecipes = await csvProcessor.getPopularRecipes(limit);
      const convertedRecipes = rawRecipes
        .map(raw => {
          try {
            return this.processor.processRecipe(raw);
          } catch {
            return null;
          }
        })
        .filter((recipe): recipe is Recipe => recipe !== null);
      
      this.cachedRecipes.set(cacheKey, convertedRecipes);
      return convertedRecipes;
      
    } catch (error) {
      console.error('❌ 인기 레시피 로드 실패:', error);
      return [];
    }
  }
  
  // 🔍 레시피 검색
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      const rawRecipes = await csvProcessor.searchRecipes(query, 50);
      
      return rawRecipes
        .map(raw => {
          try {
            return this.processor.processRecipe(raw);
          } catch {
            return null;
          }
        })
        .filter((recipe): recipe is Recipe => recipe !== null);
        
    } catch (error) {
      console.error('❌ 레시피 검색 실패:', error);
      return [];
    }
  }
  
  // 📊 통계 정보
  async getStatistics() {
    return csvProcessor.getStatistics();
  }
  
  // 🔄 캐시 클리어
  clearCache() {
    this.cachedRecipes.clear();
    console.log('🧹 레시피 캐시 클리어 완료');
  }

  // 🔍 캐시 및 시스템 상태 진단
  async diagnoseCacheStatus(): Promise<void> {
    console.log('🔍 === 레시피 시스템 진단 시작 ===');
    console.log(`📦 캐시된 목표별 레시피 수:`);
    console.log(`   - weight_loss: ${this.cachedRecipes.get('weight_loss')?.length || 0}개`);
    console.log(`   - muscle_gain: ${this.cachedRecipes.get('muscle_gain')?.length || 0}개`);
    console.log(`   - maintenance: ${this.cachedRecipes.get('maintenance')?.length || 0}개`);
    
    // 빈 캐시 강제 재로딩
    for (const goal of ['weight_loss', 'muscle_gain', 'maintenance'] as const) {
      const cached = this.cachedRecipes.get(goal);
      if (!cached || cached.length === 0) {
        console.log(`🔄 ${goal} 캐시가 비어있음, 강제 재로딩...`);
        const result = await this.getRecipesByGoal(goal);
        console.log(`✅ ${goal} 재로딩 완료: ${result.length}개`);
      }
    }
    
    console.log('🔍 === 진단 완료 ===');
  }
  
  // 🔍 레시피 찾기 (공개 메소드)
  findRecipeById(recipeId: string): Recipe | undefined {
    const allRecipes = [
      ...(this.cachedRecipes.get('weight_loss') || []),
      ...(this.cachedRecipes.get('muscle_gain') || []),
      ...(this.cachedRecipes.get('maintenance') || [])
    ];
    
    return allRecipes.find(r => r.id === recipeId);
  }
}

// 🎯 전역 레시피 로더 인스턴스
export const recipeLoader = RealTimeRecipeLoader.getInstance();

// 🍳 레시피별 재료 조회 (실제 쿠팡 상품 매핑)
export const getRecipeIngredients = (recipeId: string): RecipeIngredient[] => {
  console.log('🔍 getRecipeIngredients 호출됨, recipeId:', recipeId);
  
  // 레시피 ID로 실제 레시피 찾기
  const recipe = recipeLoader.findRecipeById(recipeId);
  let searchTerm = recipeId;
  
  if (recipe) {
    console.log('📋 찾은 레시피:', recipe.name);
    // 레시피 이름을 검색어로 사용
    searchTerm = recipe.name;
  }
  
  const ingredients = getRecipeIngredientsData(searchTerm);
  console.log('📦 매칭된 재료 수:', ingredients.length);
  console.log('🛒 재료 목록:', ingredients.map(ing => ing.product.name));
  return ingredients;
};

// 🧮 레시피 영양소 계산
export const calculateRecipeNutrition = (recipeId: string) => {
  const ingredients = getRecipeIngredients(recipeId);
  
  return ingredients.reduce((total, ingredient) => {
    const product = ingredient.product;
    const ratio = ingredient.quantity / 100; // 100g 기준
    
    return {
      calories: total.calories + (product.nutrition.calories * ratio),
      carb: total.carb + (product.nutrition.carb * ratio),
      protein: total.protein + (product.nutrition.protein * ratio),
      fat: total.fat + (product.nutrition.fat * ratio),
      sodium: total.sodium + (product.nutrition.sodium * ratio),
      sugar: total.sugar + (product.nutrition.sugar * ratio),
    };
  }, {
    calories: 0,
    carb: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    sugar: 0,
  });
};

// 🎯 통합 레시피 조회 함수 (비동기)
export const getRecipesByGoal = async (goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): Promise<Recipe[]> => {
  return recipeLoader.getRecipesByGoal(goal);
};

// 🔥 기존 동기 함수를 위한 임시 래퍼 (점진적 마이그레이션)
export const getRecipesByGoalSync = (goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): Recipe[] => {
  console.warn('⚠️ getRecipesByGoalSync는 deprecated입니다. getRecipesByGoal을 사용하세요.');
  return [];
};

// 📊 레시피 시스템 초기화
export const initializeRecipeSystem = async () => {
  console.log('🚀 만개의 레시피 시스템 초기화 중...');
  
  try {
    // 통계 정보 로드
    const stats = await recipeLoader.getStatistics();
    console.log('📊 레시피 통계:', stats);
    
    // 각 목표별 레시피 프리로드 (백그라운드)
    Promise.all([
      recipeLoader.getRecipesByGoal('weight_loss'),
      recipeLoader.getRecipesByGoal('muscle_gain'),
      recipeLoader.getRecipesByGoal('maintenance')
    ]).then(() => {
      console.log('✅ 모든 레시피 프리로드 완료');
    });
    
  } catch (error) {
    console.error('❌ 레시피 시스템 초기화 실패:', error);
  }
};

// 앱 시작시 자동 초기화
if (typeof window !== 'undefined') {
  initializeRecipeSystem();
}
