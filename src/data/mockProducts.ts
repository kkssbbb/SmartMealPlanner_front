import { CoupangProduct, UserProfile } from '../types';

// 🔥 체중감량 특화 식품 (고단백 저칼로리)
export const weightLossProducts: CoupangProduct[] = [
  {
    id: 'prod-chicken-breast-1',
    name: '하림 닭가슴살 스테이크 100g 30팩',
    price: 35900,
    originalPrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/6849764912',
    category: '다이어트 단백질',
    nutrition: {
      calories: 165,   // 닭가슴살 100g 실제 칼로리
      carb: 0,         // 탄수화물 거의 없음
      protein: 31,     // 고단백질 31g
      fat: 3.6,        // 저지방 3.6g
      sodium: 74,      // 나트륨 74mg
      sugar: 0         // 당분 없음
    },
    description: '🔥 다이어트 필수! 고단백 저칼로리 닭가슴살로 포만감과 근육량 유지',
    brand: '하림',
    weight: '100g x 30팩',
    rating: 4.8,
    reviewCount: 15420,
    isRocketDelivery: true
  },
  {
    id: 'prod-yogurt-greek-1',
    name: '덴마크 그릭요거트 플레인 150g 12개',
    price: 18900,
    originalPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/7234567890',
    category: '유제품',
    nutrition: {
      calories: 59,    // 그릭요거트 100g 칼로리
      carb: 3.6,       // 탄수화물 적음
      protein: 10,     // 단백질 풍부
      fat: 0.4,        // 저지방
      sodium: 36,      // 나트륨
      sugar: 3.6       // 자연 당분
    },
    description: '💪 고단백 저칼로리! 프로바이오틱스로 장 건강까지',
    brand: '덴마크',
    weight: '150g x 12개',
    rating: 4.7,
    reviewCount: 12350,
    isRocketDelivery: true
  },
  {
    id: 'prod-salad-mix-1',
    name: '신선한 샐러드 믹스 200g 10팩',
    price: 16900,
    originalPrice: 19000,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a579fd9f8ed8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/8345678901',
    category: '채소',
    nutrition: {
      calories: 14,    // 샐러드 믹스 100g 칼로리
      carb: 2.9,       // 탄수화물
      protein: 1.4,    // 단백질
      fat: 0.1,        // 지방 거의 없음
      sodium: 28,      // 나트륨
      sugar: 1.5       // 자연 당분
    },
    description: '🥗 신선한 샐러드로 비타민과 식이섬유 보충! 다이어트 기본템',
    brand: '신선마켓',
    weight: '200g x 10팩',
    rating: 4.5,
    reviewCount: 8930,
    isRocketDelivery: true
  },
  {
    id: 'prod-tomato-1',
    name: '방울토마토 500g 8팩',
    price: 24900,
    originalPrice: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1546470427-e7c2e42c0e5c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/9456789012',
    category: '채소',
    nutrition: {
      calories: 18,    // 토마토 100g 칼로리
      carb: 3.9,       // 탄수화물
      protein: 0.9,    // 단백질
      fat: 0.2,        // 지방
      sodium: 5,       // 나트륨 낮음
      sugar: 2.6       // 자연 당분
    },
    description: '🍅 리코펜 풍부! 항산화 효과와 낮은 칼로리로 다이어트 최적',
    brand: '농장직송',
    weight: '500g x 8팩',
    rating: 4.6,
    reviewCount: 7650,
    isRocketDelivery: true
  },
  {
    id: 'prod-egg-white-1',
    name: '계란 흰자 500ml 12팩',
    price: 28900,
    originalPrice: 33000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/5432109876',
    category: '다이어트 단백질',
    nutrition: {
      calories: 52,    // 계란 흰자 100g 칼로리
      carb: 0.7,       // 탄수화물 거의 없음
      protein: 10.9,   // 순수 단백질
      fat: 0.2,        // 지방 거의 없음
      sodium: 166,     // 나트륨
      sugar: 0.7       // 당분 적음
    },
    description: '🥚 순수 단백질 폭탄! 지방 0g으로 완벽한 다이어트 식품',
    brand: '농장달걀',
    weight: '500ml x 12팩',
    rating: 4.6,
    reviewCount: 9850,
    isRocketDelivery: true
  },
  {
    id: 'prod-cucumber-1',
    name: '유기농 오이 1kg 8팩',
    price: 19900,
    originalPrice: 23000,
    imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/6543210987',
    category: '채소',
    nutrition: {
      calories: 15,    // 오이 100g 칼로리
      carb: 3.6,       // 탄수화물
      protein: 0.7,    // 단백질
      fat: 0.1,        // 지방 거의 없음
      sodium: 2,       // 나트륨 매우 낮음
      sugar: 1.7       // 자연 당분
    },
    description: '🥒 수분 96%! 포만감 높고 칼로리 초저로 다이어트 간식 최고',
    brand: '유기농마을',
    weight: '1kg x 8팩',
    rating: 4.4,
    reviewCount: 7320,
    isRocketDelivery: true
  },
  {
    id: 'prod-broccoli-1',
    name: '신선 브로콜리 500g 10팩',
    price: 21900,
    originalPrice: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/7654321098',
    category: '채소',
    nutrition: {
      calories: 34,    // 브로콜리 100g 칼로리
      carb: 6.6,       // 탄수화물
      protein: 2.8,    // 단백질 (채소 중 높음)
      fat: 0.4,        // 지방 적음
      sodium: 33,      // 나트륨
      sugar: 1.5       // 당분 적음
    },
    description: '🥦 비타민C 폭탄! 식이섬유와 항산화 성분으로 건강 다이어트',
    brand: '신선농장',
    weight: '500g x 10팩',
    rating: 4.5,
    reviewCount: 8640,
    isRocketDelivery: true
  },
  {
    id: 'prod-tofu-1',
    name: '풀무원 연두부 300g 20개',
    price: 16900,
    originalPrice: 19500,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/8765432109',
    category: '식물성 단백질',
    nutrition: {
      calories: 76,    // 연두부 100g 칼로리
      carb: 1.9,       // 탄수화물 낮음
      protein: 8.1,    // 식물성 단백질 풍부
      fat: 4.8,        // 건강한 지방
      sodium: 7,       // 나트륨 낮음
      sugar: 0.6       // 당분 적음
    },
    description: '🍲 부드러운 식물성 단백질! 이소플라본과 칼슘 풍부',
    brand: '풀무원',
    weight: '300g x 20개',
    rating: 4.7,
    reviewCount: 11240,
    isRocketDelivery: true
  }
];

// 💪 근성장 특화 식품 (고단백 고칼로리)
export const muscleGainProducts: CoupangProduct[] = [
  {
    id: 'prod-beef-sirloin-1',
    name: '한우 등심 200g 10팩',
    price: 89900,
    originalPrice: 105000,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/5567890123',
    category: '고급 단백질',
    nutrition: {
      calories: 271,   // 한우 등심 100g 칼로리
      carb: 0,         // 탄수화물 없음
      protein: 26.1,   // 고품질 단백질
      fat: 17.7,       // 좋은 지방
      sodium: 58,      // 나트륨
      sugar: 0         // 당분 없음
    },
    description: '🥩 최고급 한우 등심! 완전 단백질과 크레아틴으로 근육 성장 극대화',
    brand: '한우마을',
    weight: '200g x 10팩',
    rating: 4.9,
    reviewCount: 3240,
    isRocketDelivery: true
  },
  {
    id: 'prod-salmon-1',
    name: '노르웨이 연어 필레 150g 8팩',
    price: 45900,
    originalPrice: 52000,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/6678901234',
    category: '고급 단백질',
    nutrition: {
      calories: 208,   // 연어 100g 칼로리
      carb: 0,         // 탄수화물 없음
      protein: 22,     // 고품질 단백질
      fat: 12.4,       // 오메가3 풍부한 지방
      sodium: 59,      // 나트륨
      sugar: 0         // 당분 없음
    },
    description: '🐟 오메가3 풍부한 프리미엄 연어! 근육 성장과 회복에 최적',
    brand: '노르웨이산',
    weight: '150g x 8팩',
    rating: 4.8,
    reviewCount: 5680,
    isRocketDelivery: true
  },
  {
    id: 'prod-quinoa-1',
    name: '유기농 퀴노아 500g 6개',
    price: 32900,
    originalPrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/7789012345',
    category: '슈퍼곡물',
    nutrition: {
      calories: 368,   // 퀴노아 100g 칼로리 (조리 전)
      carb: 64.2,      // 복합 탄수화물
      protein: 14.1,   // 완전 단백질
      fat: 6.1,        // 좋은 지방
      sodium: 5,       // 나트륨 낮음
      sugar: 0         // 당분 없음
    },
    description: '🌾 완전 단백질 슈퍼푸드! 9가지 필수 아미노산 모두 함유',
    brand: '유기농마을',
    weight: '500g x 6개',
    rating: 4.7,
    reviewCount: 4320,
    isRocketDelivery: true
  },
  {
    id: 'prod-avocado-1',
    name: '멕시코산 아보카도 12개입',
    price: 18900,
    originalPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1549176756-76a6ea5d3c83?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/8890123456',
    category: '건강 지방',
    nutrition: {
      calories: 160,   // 아보카도 100g 칼로리
      carb: 8.5,       // 탄수화물 (대부분 식이섬유)
      protein: 2,      // 단백질
      fat: 14.7,       // 건강한 단일불포화지방
      sodium: 7,       // 나트륨 매우 낮음
      sugar: 0.7       // 당분 적음
    },
    description: '🥑 건강한 지방과 칼륨 풍부! 근육 회복과 호르몬 생성 지원',
    brand: '멕시코농장',
    weight: '중과 12개입',
    rating: 4.6,
    reviewCount: 6780,
    isRocketDelivery: true
  },
  {
    id: 'prod-whole-egg-1',
    name: '유정란 대란 30개입 2판',
    price: 24900,
    originalPrice: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/9876543210',
    category: '완전 단백질',
    nutrition: {
      calories: 155,   // 계란 100g 칼로리
      carb: 1.1,       // 탄수화물 낮음
      protein: 13,     // 완전 단백질
      fat: 11,         // 건강한 지방
      sodium: 124,     // 나트륨
      sugar: 1.1       // 당분 적음
    },
    description: '🥚 완전 단백질 최고! 모든 필수 아미노산과 건강한 지방',
    brand: '행복농장',
    weight: '대란 30개 x 2판',
    rating: 4.8,
    reviewCount: 14350,
    isRocketDelivery: true
  },
  {
    id: 'prod-nuts-1',
    name: '혼합견과류 1kg (아몬드,호두,캐슈)',
    price: 35900,
    originalPrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/1357924680',
    category: '건강 지방',
    nutrition: {
      calories: 607,   // 견과류 100g 칼로리
      carb: 21.6,      // 탄수화물
      protein: 20.2,   // 식물성 단백질
      fat: 49.9,       // 불포화지방산 풍부
      sodium: 1,       // 나트륨 낮음
      sugar: 4.4       // 자연 당분
    },
    description: '🥜 불포화지방산과 비타민E 풍부! 근육 회복과 호르몬 합성 지원',
    brand: '프리미엄 너츠',
    weight: '1kg (아몬드40%, 호두30%, 캐슈30%)',
    rating: 4.7,
    reviewCount: 8920,
    isRocketDelivery: true
  },
  {
    id: 'prod-pasta-1',
    name: '듀럼밀 통밀 파스타 500g 8개',
    price: 22900,
    originalPrice: 26500,
    imageUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/2468135790',
    category: '복합 탄수화물',
    nutrition: {
      calories: 371,   // 통밀 파스타 100g 칼로리 (조리 전)
      carb: 67.5,      // 복합 탄수화물
      protein: 13.0,   // 단백질 풍부
      fat: 2.5,        // 지방 적음
      sodium: 6,       // 나트륨 낮음
      sugar: 2.7       // 당분 적음
    },
    description: '🍝 복합 탄수화물과 식이섬유! 운동 전후 에너지 공급 최적',
    brand: '이탈리아 직수입',
    weight: '500g x 8개',
    rating: 4.6,
    reviewCount: 6740,
    isRocketDelivery: true
  },
  {
    id: 'prod-banana-1',
    name: '프리미엄 바나나 1.2kg 5송이',
    price: 17900,
    originalPrice: 21000,
    imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=2804&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/3579246810',
    category: '자연 탄수화물',
    nutrition: {
      calories: 89,    // 바나나 100g 칼로리
      carb: 22.8,      // 빠른 탄수화물
      protein: 1.1,    // 단백질
      fat: 0.3,        // 지방 낮음
      sodium: 1,       // 나트륨 낮음
      sugar: 12.2      // 자연 당분
    },
    description: '🍌 운동 전후 완벽! 칼륨과 빠른 에너지로 근육 회복 지원',
    brand: '필리핀 직수입',
    weight: '1.2kg x 5송이',
    rating: 4.5,
    reviewCount: 9850,
    isRocketDelivery: true
  }
];

// ⚖️ 건강 유지 식품 (균형 잡힌 영양)
export const maintenanceProducts: CoupangProduct[] = [
  {
    id: 'prod-brown-rice-1',
    name: '유기농 현미 5kg 2포',
    price: 25900,
    originalPrice: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/9901234567',
    category: '건강 곡물',
    nutrition: {
      calories: 111,   // 현미밥 100g 칼로리
      carb: 23,        // 복합 탄수화물
      protein: 2.6,    // 단백질
      fat: 0.9,        // 지방
      sodium: 5,       // 나트륨 낮음
      sugar: 0.4       // 당분 적음
    },
    description: '🌾 식이섬유 풍부한 현미! 혈당 조절과 포만감으로 건강 유지',
    brand: '유기농들판',
    weight: '5kg x 2포',
    rating: 4.8,
    reviewCount: 9870,
    isRocketDelivery: true
  },
  {
    id: 'prod-mackerel-1',
    name: '제주 고등어 구이 120g 12팩',
    price: 28900,
    originalPrice: 33000,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/1012345678',
    category: '국산 생선',
    nutrition: {
      calories: 205,   // 고등어 100g 칼로리
      carb: 0,         // 탄수화물 없음
      protein: 18.7,   // 단백질 풍부
      fat: 13.9,       // 오메가3 풍부
      sodium: 59,      // 나트륨
      sugar: 0         // 당분 없음
    },
    description: '🐟 DHA와 EPA 풍부! 뇌 건강과 혈관 건강에 최고의 선택',
    brand: '제주바다',
    weight: '120g x 12팩',
    rating: 4.7,
    reviewCount: 7890,
    isRocketDelivery: true
  },
  {
    id: 'prod-sweet-potato-1',
    name: '해남 꿀고구마 3kg 2박스',
    price: 19900,
    originalPrice: 24000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/1123456789',
    category: '건강 탄수화물',
    nutrition: {
      calories: 86,    // 고구마 100g 칼로리 (찐 것)
      carb: 20.1,      // 복합 탄수화물
      protein: 1.6,    // 단백질
      fat: 0.1,        // 지방 거의 없음
      sodium: 54,      // 나트륨
      sugar: 4.2       // 자연 당분
    },
    description: '🍠 베타카로틴과 식이섬유 풍부! 자연 단맛으로 건강한 간식',
    brand: '해남농장',
    weight: '3kg x 2박스',
    rating: 4.8,
    reviewCount: 11230,
    isRocketDelivery: true
  },
  {
    id: 'prod-spinach-1',
    name: '유기농 시금치 200g 15팩',
    price: 22900,
    originalPrice: 26000,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/1234567890',
    category: '녹색 채소',
    nutrition: {
      calories: 23,    // 시금치 100g 칼로리
      carb: 3.6,       // 탄수화물
      protein: 2.9,    // 단백질 (채소 중 높음)
      fat: 0.4,        // 지방
      sodium: 79,      // 나트륨
      sugar: 0.4       // 당분 적음
    },
    description: '🥬 철분과 엽산 풍부! 조혈 작용과 면역력 강화에 탁월',
    brand: '유기농마을',
    weight: '200g x 15팩',
    rating: 4.6,
    reviewCount: 6540,
    isRocketDelivery: true
  },
  {
    id: 'prod-chicken-thigh-1',
    name: '신선 닭다리살 500g 8팩',
    price: 32900,
    originalPrice: 37000,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/4567890123',
    category: '단백질',
    nutrition: {
      calories: 209,   // 닭다리살 100g 칼로리
      carb: 0,         // 탄수화물 없음
      protein: 18.4,   // 단백질 풍부
      fat: 14.8,       // 적당한 지방
      sodium: 91,      // 나트륨
      sugar: 0         // 당분 없음
    },
    description: '🍗 부드럽고 맛있는 닭다리살! 단백질과 철분이 풍부',
    brand: '신선농장',
    weight: '500g x 8팩',
    rating: 4.7,
    reviewCount: 8760,
    isRocketDelivery: true
  },
  {
    id: 'prod-mushroom-1',
    name: '혼합버섯 400g 10팩 (새송이,표고,팽이)',
    price: 26900,
    originalPrice: 31000,
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/5678901234',
    category: '버섯',
    nutrition: {
      calories: 22,    // 혼합버섯 100g 칼로리
      carb: 3.3,       // 탄수화물
      protein: 3.1,    // 단백질 (버섯 중 높음)
      fat: 0.3,        // 지방 낮음
      sodium: 5,       // 나트륨 낮음
      sugar: 2.0       // 자연 당분
    },
    description: '🍄 면역력 강화 베타글루칸! 식이섬유와 비타민D 풍부',
    brand: '국산 버섯',
    weight: '400g x 10팩',
    rating: 4.5,
    reviewCount: 7240,
    isRocketDelivery: true
  },
  {
    id: 'prod-cabbage-1',
    name: '신선 양배추 1.5kg 6개',
    price: 18900,
    originalPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1594282832057-ceb2c3d9ad14?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/6789012345',
    category: '채소',
    nutrition: {
      calories: 25,    // 양배추 100g 칼로리
      carb: 5.8,       // 탄수화물
      protein: 1.3,    // 단백질
      fat: 0.1,        // 지방 낮음
      sodium: 18,      // 나트륨 낮음
      sugar: 3.2       // 자연 당분
    },
    description: '🥬 비타민C와 식이섬유 풍부! 위 건강과 소화에 도움',
    brand: '고랭지 채소',
    weight: '1.5kg x 6개',
    rating: 4.4,
    reviewCount: 5890,
    isRocketDelivery: true
  },
  {
    id: 'prod-garlic-1',
    name: '국산 마늘 1kg 5포',
    price: 24900,
    originalPrice: 28500,
    imageUrl: 'https://images.unsplash.com/photo-1553164735-a6b4b94f40e3?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3',
    coupangUrl: 'https://www.coupang.com/vp/products/7890123456',
    category: '향신료',
    nutrition: {
      calories: 42,    // 마늘 100g 칼로리
      carb: 9.3,       // 탄수화물
      protein: 1.9,    // 단백질
      fat: 0.1,        // 지방 낮음
      sodium: 3,       // 나트륨 낮음
      sugar: 1.0       // 당분 적음
    },
    description: '🧄 알리신 성분으로 면역력 UP! 항산화와 항염 효과',
    brand: '의성 마늘',
    weight: '1kg x 5포',
    rating: 4.8,
    reviewCount: 12340,
    isRocketDelivery: true
  }
];

// 🔄 통합 상품 리스트
export const mockProducts: CoupangProduct[] = [
  ...weightLossProducts,
  ...muscleGainProducts,
  ...maintenanceProducts
];

// 🎯 목표별 상품 추천 함수 (향상된 버전)
export const getRecommendedProducts = (
  carbRatio: number,
  proteinRatio: number,
  fatRatio: number,
  budget: number,
  userGoal: UserProfile['goal']
): CoupangProduct[] => {
  let targetProducts: CoupangProduct[] = [];

  // 목표에 따른 상품 선별
  switch (userGoal) {
    case 'weight_loss':
      targetProducts = weightLossProducts.filter(p => 
        p.nutrition.calories < 200 || // 저칼로리
        p.nutrition.protein > 15      // 고단백
      );
      break;
    case 'muscle_gain':
      targetProducts = muscleGainProducts.filter(p => 
        p.nutrition.protein > 15 ||   // 고단백
        p.nutrition.calories > 150    // 적절한 칼로리
      );
      break;
    case 'maintenance':
      targetProducts = maintenanceProducts.filter(p => 
        p.nutrition.calories > 80 && p.nutrition.calories < 300 // 균형
      );
      break;
    default:
      targetProducts = mockProducts;
  }

  // 예산 내 상품 필터링
  const affordableProducts = targetProducts.filter(product => 
    product.price <= budget * 0.3 // 한 상품이 전체 예산의 30%를 넘지 않도록
  );

  // 영양소 비율에 따른 정렬
  const sortedProducts = affordableProducts.sort((a, b) => {
    const aScore = calculateNutrientScore(a, proteinRatio, carbRatio, fatRatio);
    const bScore = calculateNutrientScore(b, proteinRatio, carbRatio, fatRatio);
    return bScore - aScore;
  });

  return sortedProducts.slice(0, 12); // 상위 12개 반환
};

// 영양소 점수 계산 함수
const calculateNutrientScore = (
  product: CoupangProduct,
  proteinTarget: number,
  carbTarget: number,
  fatTarget: number
): number => {
  const { nutrition } = product;
  const totalCalories = nutrition.calories;
  
  if (totalCalories === 0) return 0;

  // 칼로리 대비 영양소 비율 계산
  const proteinRatio = (nutrition.protein * 4) / totalCalories * 100;
  const carbRatio = (nutrition.carb * 4) / totalCalories * 100;
  const fatRatio = (nutrition.fat * 9) / totalCalories * 100;

  // 목표 비율과의 차이 계산 (작을수록 좋음)
  const proteinDiff = Math.abs(proteinRatio - proteinTarget);
  const carbDiff = Math.abs(carbRatio - carbTarget);
  const fatDiff = Math.abs(fatRatio - fatTarget);

  // 점수 계산 (차이가 작을수록 높은 점수)
  const score = 100 - (proteinDiff + carbDiff + fatDiff) / 3;
  
  return Math.max(0, score);
};

// 🌟 목표별 추천 메시지 생성
export const getRecommendationMessage = (goal: UserProfile['goal']): string => {
  const messages = {
    weight_loss: '🔥 다이어트에 최적화된 맛있는 레시피들을 준비했어요!',
    muscle_gain: '💪 근육 성장을 위한 고단백 요리들로 구성했어요!',
    maintenance: '⚖️ 균형 잡힌 영양소의 건강한 레시피를 추천드려요!',
  };

  return messages[goal] || '🎯 맞춤형 레시피를 준비했어요!';
};

// 🍳 새로운 레시피 기반 식단 추천 함수 (현재는 기존 상품 추천 함수를 사용)
export const getRecommendedMeals = (
  carbRatio: number,
  proteinRatio: number,
  fatRatio: number,
  budget: number,
  userGoal: UserProfile['goal']
) => {
  // 일단 기존 함수를 import해서 사용하되, 나중에 레시피 기반으로 완전 교체
  return getRecommendedProducts(carbRatio, proteinRatio, fatRatio, budget, userGoal);
};