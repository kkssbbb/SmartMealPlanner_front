// 🔍 레시피 디버깅 유틸리티

export const debugRecipeMapping = () => {
  console.log('🔍 === 레시피 매핑 디버깅 시작 ===');
  
  // 테스트할 레시피 ID들
  const testRecipeIds = [
    'mankae-7014691', // 계란말이밥
    'mankae-7014692', // 배추찜
    'mankae-7014693', // 어묵볶음
    'mankae-7014694', // 아보카도연어덮밥
    'mankae-7014695', // 우삼겹숙주찜
    'mankae-7014698', // 떡볶이
    'diet-protein-breakfast', // 기존 레시피
    'muscle-power-lunch', // 기존 레시피
    'test-unknown-recipe' // 알 수 없는 레시피
  ];
  
  testRecipeIds.forEach(recipeId => {
    console.log(`\n🧪 테스트 레시피 ID: ${recipeId}`);
    try {
      // 동적 import로 함수 호출
      import('../data/recipeIngredients').then(({ getRecipeIngredientsData }) => {
        const ingredients = getRecipeIngredientsData(recipeId);
        console.log(`📦 매핑된 재료 수: ${ingredients.length}`);
        console.log(`🛒 재료들:`, ingredients.map(ing => `${ing.product.name} (${ing.quantity}${ing.unit})`));
      });
    } catch (error) {
      console.error(`❌ 에러:`, error);
    }
  });
};

// 브라우저 콘솔에서 호출할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  (window as any).debugRecipeMapping = debugRecipeMapping;
}

export default debugRecipeMapping;
