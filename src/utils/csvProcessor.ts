import { MankaeLRecipeRaw } from './recipeDataProcessor';

// 🔥 CSV 데이터 처리를 위한 고성능 프로세서
export class CSVProcessor {
  private static instance: CSVProcessor;
  private recipesCache: MankaeLRecipeRaw[] | null = null;
  
  private constructor() {}
  
  static getInstance(): CSVProcessor {
    if (!CSVProcessor.instance) {
      CSVProcessor.instance = new CSVProcessor();
    }
    return CSVProcessor.instance;
  }
  
  // CSV 파일 로드 및 파싱
  async loadCSVData(): Promise<MankaeLRecipeRaw[]> {
    if (this.recipesCache) {
      console.log('📦 캐시된 레시피 데이터 사용');
      return this.recipesCache;
    }
    
    try {
      console.log('🔄 CSV 파일 로딩 중...');
      
      // Public 폴더에서 CSV 파일 로드
      const response = await fetch('/data/TB_RECIPE_SEARCH_241226.csv');
      const csvText = await response.text();
      
      console.log('📊 CSV 파싱 시작...');
      const recipes = this.parseCSV(csvText);
      
      console.log(`✅ 총 ${recipes.length}개 레시피 로드 완료`);
      this.recipesCache = recipes;
      
      return recipes;
    } catch (error) {
      console.error('❌ CSV 로드 실패:', error);
      throw error;
    }
  }
  
  // CSV 텍스트 파싱
  private parseCSV(csvText: string): MankaeLRecipeRaw[] {
    const lines = csvText.split('\n');
    const headers = this.parseCSVLine(lines[0]);
    
    const recipes: MankaeLRecipeRaw[] = [];
    
    // 헤더 제외하고 파싱 (최대 10,000개로 제한)
    const maxRecipes = 10000;
    for (let i = 1; i < Math.min(lines.length, maxRecipes + 1); i++) {
      if (!lines[i].trim()) continue;
      
      try {
        const values = this.parseCSVLine(lines[i]);
        const recipe = this.createRecipeObject(headers, values);
        
        // 유효한 레시피만 추가
        if (recipe && recipe.RCP_SNO && recipe.CKG_NM) {
          recipes.push(recipe);
        }
      } catch (error) {
        console.warn(`⚠️ ${i}번째 라인 파싱 실패:`, error);
      }
    }
    
    return recipes;
  }
  
  // CSV 라인 파싱 (쉼표와 따옴표 처리)
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  
  // 레시피 객체 생성
  private createRecipeObject(headers: string[], values: string[]): MankaeLRecipeRaw {
    const recipe: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // 숫자 필드 변환
      if (['INQ_CNT', 'RCMM_CNT', 'SRAP_CNT'].includes(header)) {
        recipe[header] = parseInt(value) || 0;
      } else {
        recipe[header] = value;
      }
    });
    
    // 추가 필드 (CSV에 없는 경우 기본값)
    recipe.RCP_IMG_URL = recipe.RCP_IMG_URL || '';
    
    return recipe as MankaeLRecipeRaw;
  }
  
  // 🎯 필터링 및 검색 기능
  async searchRecipes(query: string, limit: number = 100): Promise<MankaeLRecipeRaw[]> {
    const allRecipes = await this.loadCSVData();
    const lowerQuery = query.toLowerCase();
    
    return allRecipes
      .filter(recipe => 
        recipe.CKG_NM.toLowerCase().includes(lowerQuery) ||
        recipe.RCP_TTL.toLowerCase().includes(lowerQuery) ||
        recipe.CKG_IPDC.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }
  
  // 🔥 인기 레시피 조회
  async getPopularRecipes(limit: number = 100): Promise<MankaeLRecipeRaw[]> {
    const allRecipes = await this.loadCSVData();
    
    return allRecipes
      .sort((a, b) => b.INQ_CNT - a.INQ_CNT)
      .slice(0, limit);
  }
  
  // 🎯 목표별 레시피 필터링
  async getRecipesByKeywords(keywords: string[], limit: number = 50): Promise<MankaeLRecipeRaw[]> {
    const allRecipes = await this.loadCSVData();
    
    return allRecipes
      .filter(recipe => {
        const content = `${recipe.CKG_NM} ${recipe.RCP_TTL} ${recipe.CKG_IPDC}`.toLowerCase();
        return keywords.some(keyword => content.includes(keyword.toLowerCase()));
      })
      .slice(0, limit);
  }
  
  // 📊 통계 정보
  async getStatistics(): Promise<{
    totalRecipes: number;
    avgViews: number;
    avgScraps: number;
    topCategories: Array<{ category: string; count: number }>;
    topCookingMethods: Array<{ method: string; count: number }>;
  }> {
    const allRecipes = await this.loadCSVData();
    
    // 카테고리별 집계
    const categoryCount: Record<string, number> = {};
    const methodCount: Record<string, number> = {};
    
    let totalViews = 0;
    let totalScraps = 0;
    
    allRecipes.forEach(recipe => {
      // 조회수/스크랩 합계
      totalViews += recipe.INQ_CNT;
      totalScraps += recipe.SRAP_CNT;
      
      // 카테고리 집계
      if (recipe.CKG_KND_ACTO_NM) {
        categoryCount[recipe.CKG_KND_ACTO_NM] = (categoryCount[recipe.CKG_KND_ACTO_NM] || 0) + 1;
      }
      
      // 조리법 집계
      if (recipe.CKG_MTH_ACTO_NM) {
        methodCount[recipe.CKG_MTH_ACTO_NM] = (methodCount[recipe.CKG_MTH_ACTO_NM] || 0) + 1;
      }
    });
    
    // 상위 카테고리/조리법 추출
    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));
      
    const topCookingMethods = Object.entries(methodCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([method, count]) => ({ method, count }));
    
    return {
      totalRecipes: allRecipes.length,
      avgViews: Math.round(totalViews / allRecipes.length),
      avgScraps: Math.round(totalScraps / allRecipes.length),
      topCategories,
      topCookingMethods
    };
  }
}

// 🎯 싱글톤 인스턴스 export
export const csvProcessor = CSVProcessor.getInstance();
