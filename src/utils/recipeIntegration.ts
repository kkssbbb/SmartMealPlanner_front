import { Recipe } from '../types';
import { recipeLoader } from '../data/recipeData';

// 🔄 레시피 통합 관리자 (새로운 CSV 기반 시스템 래퍼)
export class RecipeIntegrationManager {
  async getRecipesByGoal(goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): Promise<Recipe[]> {
    return recipeLoader.getRecipesByGoal(goal);
  }
  
  async getPopularRecipes(limit: number = 10): Promise<Recipe[]> {
    return recipeLoader.getPopularRecipes(limit);
  }
  
  async searchRecipes(query: string): Promise<Recipe[]> {
    return recipeLoader.searchRecipes(query);
  }
  
  async getStatistics() {
    return recipeLoader.getStatistics();
  }
}

// 🎯 전역 인스턴스 생성
export const recipeManager = new RecipeIntegrationManager();

// 📊 변환 결과 리포트 생성 (비동기)
export const generateConversionReport = async () => {
  const stats = await recipeManager.getStatistics();
  
  console.log('\n📊 === 만개의 레시피 통합 리포트 ===');
  console.log(`🔢 총 레시피 수: ${stats.totalRecipes}개`);
  console.log(`👀 평균 조회수: ${stats.avgViews}회`);
  console.log(`⭐ 평균 스크랩: ${stats.avgScraps}개`);
  console.log(`🍳 인기 카테고리:`);
  stats.topCategories.slice(0, 5).forEach((cat, idx) => {
    console.log(`   ${idx + 1}. ${cat.category}: ${cat.count}개`);
  });
  console.log(`👨‍🍳 인기 조리법:`);
  stats.topCookingMethods.slice(0, 5).forEach((method, idx) => {
    console.log(`   ${idx + 1}. ${method.method}: ${method.count}개`);
  });
  console.log('========================================\n');
  
  return stats;
};

// 📋 샘플 레시피 미리보기 (비동기)
export const previewConvertedRecipes = async () => {
  console.log('\n🔍 === 인기 레시피 미리보기 ===');
  
  try {
    const popularRecipes = await recipeManager.getPopularRecipes(3);
    
    popularRecipes.forEach((recipe, index) => {
      console.log(`\n${index + 1}. ${recipe.name}`);
      console.log(`   🎯 목표: ${recipe.goalFit.join(', ')}`);
      console.log(`   ⏱️ 시간: ${recipe.cookingTime}분`);
      console.log(`   🎓 난이도: ${recipe.difficulty}`);
      console.log(`   ⭐ 평점: ${recipe.userRatings?.overall || 'N/A'}`);
      console.log(`   🧑‍🍳 요리사: ${recipe.sourceInfo?.chef || 'N/A'}`);
      console.log(`   💡 설명: ${recipe.description.substring(0, 50)}...`);
    });
  } catch (error) {
    console.error('❌ 레시피 미리보기 실패:', error);
  }
  
  console.log('\n=======================================\n');
};