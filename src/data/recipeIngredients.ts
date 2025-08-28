import { RecipeIngredient, CoupangProduct } from '../types';
import { mockProducts } from './mockProducts';

// 🛒 레시피별 쿠팡 재료 매핑 데이터
// 실제 백엔드 연동 전까지 사용할 현실적인 목데이터

// 재료명 → 쿠팡 상품 매핑
const ingredientProductMapping: Record<string, CoupangProduct> = {
  // 🥚 계란/유제품
  '계란': {
    id: 'prod-egg-fresh-30',
    name: '신선한 계란 30구',
    price: 8900,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/03/15/11/8/5d5f5f5f-8888-4444-9999-123456789012.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/egg-30',
    category: '계란/유제품',
    nutrition: { calories: 155, carb: 1.1, protein: 12.6, fat: 11.1, sodium: 124, sugar: 0.6 },
    description: '신선한 특란 30구입',
    brand: '농협',
    weight: '30구 (약 1.8kg)',
    rating: 4.8,
    reviewCount: 15234,
    isRocketDelivery: true
  },
  '우유': {
    id: 'prod-milk-fresh-1l',
    name: '서울우유 1L',
    price: 2980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/04/01/10/7/milk-fresh-image.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/milk-1l',
    category: '계란/유제품',
    nutrition: { calories: 65, carb: 4.8, protein: 3.3, fat: 3.7, sodium: 44, sugar: 4.8 },
    description: '신선한 1등급 우유',
    brand: '서울우유',
    weight: '1L',
    rating: 4.9,
    reviewCount: 23456,
    isRocketDelivery: true
  },

  // 🥬 채소류
  '알배기배추': {
    id: 'prod-cabbage-mini-3',
    name: '알배기배추 3통',
    price: 4980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/20/14/2/cabbage-mini.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/cabbage-mini',
    category: '채소',
    nutrition: { calories: 14, carb: 2.8, protein: 1.3, fat: 0.1, sodium: 18, sugar: 1.2 },
    description: '신선한 국내산 알배기배추',
    brand: '곰곰',
    weight: '3통 (약 1.5kg)',
    rating: 4.7,
    reviewCount: 8976,
    isRocketDelivery: true
  },
  '배추': {
    id: 'prod-cabbage-full-1',
    name: '국내산 배추 1포기',
    price: 3980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/01/09/5/cabbage-full.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/cabbage-full',
    category: '채소',
    nutrition: { calories: 14, carb: 2.8, protein: 1.3, fat: 0.1, sodium: 18, sugar: 1.2 },
    description: '싱싱한 절임배추용 배추',
    brand: '농협',
    weight: '1포기 (약 3kg)',
    rating: 4.6,
    reviewCount: 12345,
    isRocketDelivery: true
  },
  '대파': {
    id: 'prod-green-onion-500g',
    name: '대파 500g',
    price: 2480,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/06/15/16/8/green-onion.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/green-onion',
    category: '채소',
    nutrition: { calories: 27, carb: 6.2, protein: 1.4, fat: 0.1, sodium: 5, sugar: 2.5 },
    description: '신선한 대파',
    brand: '농협',
    weight: '500g (약 5대)',
    rating: 4.5,
    reviewCount: 6789,
    isRocketDelivery: true
  },
  '양파': {
    id: 'prod-onion-3kg',
    name: '양파 3kg',
    price: 5980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/07/10/11/3/onion-bag.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/onion-3kg',
    category: '채소',
    nutrition: { calories: 37, carb: 8.9, protein: 1.0, fat: 0.1, sodium: 4, sugar: 4.2 },
    description: '국내산 양파',
    brand: '곰곰',
    weight: '3kg (약 15개)',
    rating: 4.8,
    reviewCount: 15678,
    isRocketDelivery: true
  },
  '당근': {
    id: 'prod-carrot-1kg',
    name: '국내산 당근 1kg',
    price: 3480,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/08/05/13/7/carrot-fresh.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/carrot-1kg',
    category: '채소',
    nutrition: { calories: 37, carb: 8.8, protein: 0.8, fat: 0.2, sodium: 69, sugar: 4.7 },
    description: '아삭한 국내산 당근',
    brand: '농협',
    weight: '1kg (약 5-7개)',
    rating: 4.7,
    reviewCount: 9876,
    isRocketDelivery: true
  },
  '마늘': {
    id: 'prod-garlic-peeled-200g',
    name: '깐마늘 200g',
    price: 4980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/09/20/15/2/garlic-peeled.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/garlic-peeled',
    category: '채소',
    nutrition: { calories: 130, carb: 28.4, protein: 6.2, fat: 0.3, sodium: 17, sugar: 1.0 },
    description: '국내산 깐마늘',
    brand: '곰곰',
    weight: '200g',
    rating: 4.6,
    reviewCount: 7654,
    isRocketDelivery: true
  },
  '숙주': {
    id: 'prod-bean-sprout-300g',
    name: '숙주나물 300g',
    price: 1980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/10/15/14/9/bean-sprout.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/bean-sprout',
    category: '채소',
    nutrition: { calories: 13, carb: 2.1, protein: 1.4, fat: 0.1, sodium: 4, sugar: 0.2 },
    description: '아삭한 숙주나물',
    brand: '농협',
    weight: '300g',
    rating: 4.5,
    reviewCount: 5432,
    isRocketDelivery: true
  },
  '깻잎': {
    id: 'prod-perilla-leaves-100g',
    name: '깻잎 100장',
    price: 2480,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/10/16/4/perilla-leaves.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/perilla-leaves',
    category: '채소',
    nutrition: { calories: 41, carb: 7.1, protein: 3.9, fat: 0.7, sodium: 1, sugar: 0.5 },
    description: '향긋한 깻잎',
    brand: '농협',
    weight: '100장 (약 150g)',
    rating: 4.6,
    reviewCount: 6789,
    isRocketDelivery: true
  },
  '감자': {
    id: 'prod-potato-2kg',
    name: '감자 2kg',
    price: 4980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/12/01/10/6/potato-bag.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/potato-2kg',
    category: '채소',
    nutrition: { calories: 77, carb: 17.5, protein: 2.0, fat: 0.1, sodium: 6, sugar: 0.8 },
    description: '포슬포슬한 감자',
    brand: '곰곰',
    weight: '2kg (약 10-15개)',
    rating: 4.7,
    reviewCount: 11234,
    isRocketDelivery: true
  },

  // 🥩 육류
  '소고기': {
    id: 'prod-beef-bulgogi-400g',
    name: '소불고기용 400g',
    price: 15900,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/03/25/17/3/beef-bulgogi.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/beef-bulgogi',
    category: '육류',
    nutrition: { calories: 250, carb: 0, protein: 20, fat: 18, sodium: 55, sugar: 0 },
    description: '1등급 한우 불고기용',
    brand: '농협한우',
    weight: '400g',
    rating: 4.8,
    reviewCount: 8765,
    isRocketDelivery: true
  },
  '우삼겹': {
    id: 'prod-beef-samgyup-500g',
    name: '우삼겹 구이용 500g',
    price: 18900,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/04/15/18/2/beef-samgyup.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/beef-samgyup',
    category: '육류',
    nutrition: { calories: 331, carb: 0, protein: 15, fat: 30, sodium: 60, sugar: 0 },
    description: '1++ 한우 우삼겹',
    brand: '농협한우',
    weight: '500g',
    rating: 4.9,
    reviewCount: 6543,
    isRocketDelivery: true
  },
  '돼지고기': {
    id: 'prod-pork-belly-500g',
    name: '삼겹살 구이용 500g',
    price: 12900,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/20/19/8/pork-belly.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/pork-belly',
    category: '육류',
    nutrition: { calories: 518, carb: 0, protein: 9, fat: 53, sodium: 50, sugar: 0 },
    description: '1등급 국내산 삼겹살',
    brand: '농협',
    weight: '500g',
    rating: 4.7,
    reviewCount: 12345,
    isRocketDelivery: true
  },
  '돼지등뼈': {
    id: 'prod-pork-backbone-2kg',
    name: '감자탕용 돼지등뼈 2kg',
    price: 16900,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/06/10/11/5/pork-backbone.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/pork-backbone',
    category: '육류',
    nutrition: { calories: 250, carb: 0, protein: 18, fat: 19, sodium: 70, sugar: 0 },
    description: '신선한 감자탕용 등뼈',
    brand: '농협',
    weight: '2kg',
    rating: 4.8,
    reviewCount: 9876,
    isRocketDelivery: true
  },

  // 🐟 해산물
  '훈제연어': {
    id: 'prod-salmon-smoked-200g',
    name: '훈제연어 슬라이스 200g',
    price: 9900,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/07/05/12/4/salmon-smoked.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/salmon-smoked',
    category: '해산물',
    nutrition: { calories: 117, carb: 0, protein: 25.4, fat: 4.3, sodium: 900, sugar: 0 },
    description: '노르웨이산 훈제연어',
    brand: '코스트코',
    weight: '200g',
    rating: 4.8,
    reviewCount: 7654,
    isRocketDelivery: true
  },

  // 🥑 과일/채소
  '아보카도': {
    id: 'prod-avocado-5ea',
    name: '아보카도 5개입',
    price: 7900,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/08/15/13/7/avocado-pack.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/avocado-5ea',
    category: '과일',
    nutrition: { calories: 190, carb: 8.6, protein: 2.0, fat: 19.5, sodium: 7, sugar: 0.7 },
    description: '멕시코산 아보카도',
    brand: '델몬트',
    weight: '5개 (약 800g)',
    rating: 4.6,
    reviewCount: 8765,
    isRocketDelivery: true
  },

  // 🍚 곡물류
  '밥': {
    id: 'prod-instant-rice-12',
    name: '햇반 백미밥 12개입',
    price: 11900,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/09/01/14/3/instant-rice.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/instant-rice',
    category: '곡물/면',
    nutrition: { calories: 130, carb: 29, protein: 2.5, fat: 0.3, sodium: 0, sugar: 0 },
    description: 'CJ 햇반 백미밥',
    brand: 'CJ제일제당',
    weight: '210g x 12개',
    rating: 4.9,
    reviewCount: 23456,
    isRocketDelivery: true
  },
  '떡볶이떡': {
    id: 'prod-rice-cake-1kg',
    name: '떡볶이떡 1kg',
    price: 4980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/10/10/15/6/rice-cake.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/rice-cake',
    category: '곡물/면',
    nutrition: { calories: 124, carb: 28, protein: 2.6, fat: 0.4, sodium: 400, sugar: 2 },
    description: '쫄깃한 떡볶이떡',
    brand: '오뚜기',
    weight: '1kg',
    rating: 4.7,
    reviewCount: 12345,
    isRocketDelivery: true
  },

  // 🥫 가공식품
  '비엔나': {
    id: 'prod-sausage-vienna-500g',
    name: '비엔나소시지 500g',
    price: 6980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/05/16/8/vienna-sausage.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/vienna-sausage',
    category: '가공식품',
    nutrition: { calories: 315, carb: 2, protein: 12, fat: 28.5, sodium: 800, sugar: 1 },
    description: '진주햄 비엔나소시지',
    brand: '진주햄',
    weight: '500g',
    rating: 4.5,
    reviewCount: 8765,
    isRocketDelivery: true
  },
  '사각어묵': {
    id: 'prod-fishcake-square-500g',
    name: '사각어묵 500g',
    price: 3980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/12/20/17/2/fishcake-square.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/fishcake-square',
    category: '가공식품',
    nutrition: { calories: 95, carb: 8, protein: 11, fat: 2, sodium: 450, sugar: 3 },
    description: '부산 사각어묵',
    brand: '삼진어묵',
    weight: '500g',
    rating: 4.8,
    reviewCount: 9876,
    isRocketDelivery: true
  },
  '어묵': {
    id: 'prod-fishcake-mixed-800g',
    name: '모듬어묵 800g',
    price: 5980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/01/15/18/5/fishcake-mixed.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/fishcake-mixed',
    category: '가공식품',
    nutrition: { calories: 95, carb: 8, protein: 11, fat: 2, sodium: 450, sugar: 3 },
    description: '부산 모듬어묵',
    brand: '삼진어묵',
    weight: '800g',
    rating: 4.7,
    reviewCount: 7654,
    isRocketDelivery: true
  },
  '만두': {
    id: 'prod-dumpling-meat-1kg',
    name: '고기만두 1kg',
    price: 8980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/02/25/19/7/dumpling-meat.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/dumpling-meat',
    category: '가공식품',
    nutrition: { calories: 200, carb: 25, protein: 8, fat: 7, sodium: 400, sugar: 2 },
    description: '비비고 왕교자만두',
    brand: 'CJ제일제당',
    weight: '1kg (약 24개)',
    rating: 4.8,
    reviewCount: 15432,
    isRocketDelivery: true
  },

  // 🧂 양념/소스
  '간장': {
    id: 'prod-soysauce-jin-500ml',
    name: '진간장 500ml',
    price: 3480,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/03/30/10/9/soysauce-jin.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/soysauce-jin',
    category: '양념/소스',
    nutrition: { calories: 53, carb: 4.6, protein: 8.9, fat: 0.1, sodium: 5500, sugar: 1 },
    description: '샘표 진간장',
    brand: '샘표',
    weight: '500ml',
    rating: 4.9,
    reviewCount: 18765,
    isRocketDelivery: true
  },
  '고추장': {
    id: 'prod-gochujang-500g',
    name: '태양초 고추장 500g',
    price: 4980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/04/20/11/6/gochujang.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/gochujang',
    category: '양념/소스',
    nutrition: { calories: 230, carb: 45, protein: 5, fat: 3, sodium: 2500, sugar: 20 },
    description: '해찬들 태양초고추장',
    brand: 'CJ제일제당',
    weight: '500g',
    rating: 4.8,
    reviewCount: 14567,
    isRocketDelivery: true
  },
  '된장': {
    id: 'prod-doenjang-500g',
    name: '재래식 된장 500g',
    price: 5980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/15/12/4/doenjang.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/doenjang',
    category: '양념/소스',
    nutrition: { calories: 180, carb: 15, protein: 12, fat: 8, sodium: 3000, sugar: 2 },
    description: '해찬들 재래식된장',
    brand: 'CJ제일제당',
    weight: '500g',
    rating: 4.7,
    reviewCount: 11234,
    isRocketDelivery: true
  },
  '고춧가루': {
    id: 'prod-redpepper-powder-500g',
    name: '고춧가루 500g',
    price: 12900,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/06/25/13/8/redpepper-powder.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/redpepper-powder',
    category: '양념/소스',
    nutrition: { calories: 280, carb: 55, protein: 10, fat: 7, sodium: 50, sugar: 10 },
    description: '영양 고춧가루',
    brand: '농협',
    weight: '500g',
    rating: 4.8,
    reviewCount: 9876,
    isRocketDelivery: true
  },
  '참기름': {
    id: 'prod-sesame-oil-320ml',
    name: '참기름 320ml',
    price: 8980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/07/30/14/2/sesame-oil.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/sesame-oil',
    category: '양념/소스',
    nutrition: { calories: 900, carb: 0, protein: 0, fat: 100, sodium: 0, sugar: 0 },
    description: '오뚜기 고소한 참기름',
    brand: '오뚜기',
    weight: '320ml',
    rating: 4.9,
    reviewCount: 21234,
    isRocketDelivery: true
  },
  '식초': {
    id: 'prod-vinegar-500ml',
    name: '양조식초 500ml',
    price: 2480,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/08/10/15/5/vinegar.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/vinegar',
    category: '양념/소스',
    nutrition: { calories: 20, carb: 0.1, protein: 0, fat: 0, sodium: 5, sugar: 0 },
    description: '오뚜기 양조식초',
    brand: '오뚜기',
    weight: '500ml',
    rating: 4.7,
    reviewCount: 8765,
    isRocketDelivery: true
  },
  '설탕': {
    id: 'prod-sugar-white-3kg',
    name: '백설탕 3kg',
    price: 5980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/09/05/16/3/sugar-white.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/sugar-white',
    category: '양념/소스',
    nutrition: { calories: 387, carb: 99.8, protein: 0, fat: 0, sodium: 0, sugar: 99.8 },
    description: 'CJ 백설 하얀설탕',
    brand: 'CJ제일제당',
    weight: '3kg',
    rating: 4.8,
    reviewCount: 16789,
    isRocketDelivery: true
  },
  '소금': {
    id: 'prod-salt-sea-1kg',
    name: '천일염 1kg',
    price: 3480,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/10/20/17/7/salt-sea.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/salt-sea',
    category: '양념/소스',
    nutrition: { calories: 0, carb: 0, protein: 0, fat: 0, sodium: 38700, sugar: 0 },
    description: '신안 천일염',
    brand: '농협',
    weight: '1kg',
    rating: 4.9,
    reviewCount: 12345,
    isRocketDelivery: true
  },

  // 🥛 기타
  '땅콩버터': {
    id: 'prod-peanutbutter-500g',
    name: '땅콩버터 크런치 500g',
    price: 7980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/15/18/9/peanutbutter.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/peanutbutter',
    category: '잼/스프레드',
    nutrition: { calories: 588, carb: 22.3, protein: 22.5, fat: 49.9, sodium: 350, sugar: 9 },
    description: '스키피 땅콩버터',
    brand: '스키피',
    weight: '500g',
    rating: 4.7,
    reviewCount: 6789,
    isRocketDelivery: true
  },
  '마요네즈': {
    id: 'prod-mayonnaise-500g',
    name: '마요네즈 500g',
    price: 4980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/12/10/19/4/mayonnaise.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/mayonnaise',
    category: '양념/소스',
    nutrition: { calories: 680, carb: 2.9, protein: 1.1, fat: 75.3, sodium: 670, sugar: 1.5 },
    description: '오뚜기 마요네즈',
    brand: '오뚜기',
    weight: '500g',
    rating: 4.8,
    reviewCount: 14567,
    isRocketDelivery: true
  },

  // 🍄 버섯류
  '팽이버섯': {
    id: 'prod-mushroom-enoki-150g',
    name: '팽이버섯 150g x 3봉',
    price: 2980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/01/25/20/6/mushroom-enoki.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/mushroom-enoki',
    category: '채소',
    nutrition: { calories: 22, carb: 5, protein: 2.7, fat: 0.3, sodium: 5, sugar: 0.2 },
    description: '신선한 팽이버섯',
    brand: '농협',
    weight: '150g x 3봉',
    rating: 4.6,
    reviewCount: 5678,
    isRocketDelivery: true
  },
  '느타리버섯': {
    id: 'prod-mushroom-oyster-300g',
    name: '느타리버섯 300g',
    price: 2480,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/02/15/21/3/mushroom-oyster.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/mushroom-oyster',
    category: '채소',
    nutrition: { calories: 33, carb: 6.1, protein: 3.3, fat: 0.4, sodium: 18, sugar: 1.1 },
    description: '신선한 느타리버섯',
    brand: '농협',
    weight: '300g',
    rating: 4.5,
    reviewCount: 4321,
    isRocketDelivery: true
  },

  // 🥬 추가 채소
  '청경채': {
    id: 'prod-bokchoy-300g',
    name: '청경채 300g',
    price: 2980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/03/05/22/8/bokchoy.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/bokchoy',
    category: '채소',
    nutrition: { calories: 13, carb: 2.2, protein: 1.5, fat: 0.2, sodium: 65, sugar: 1.2 },
    description: '아삭한 청경채',
    brand: '농협',
    weight: '300g (약 3개)',
    rating: 4.4,
    reviewCount: 3456,
    isRocketDelivery: true
  },

  // 🥣 기타 양념
  '다진마늘': {
    id: 'prod-garlic-minced-200g',
    name: '다진마늘 200g',
    price: 5480,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/04/25/23/2/garlic-minced.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/garlic-minced',
    category: '양념/소스',
    nutrition: { calories: 130, carb: 28.4, protein: 6.2, fat: 0.3, sodium: 17, sugar: 1.0 },
    description: '곰곰 다진마늘',
    brand: '곰곰',
    weight: '200g',
    rating: 4.7,
    reviewCount: 9876,
    isRocketDelivery: true
  },
  '생강': {
    id: 'prod-ginger-fresh-200g',
    name: '생강 200g',
    price: 3980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/30/00/5/ginger-fresh.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/ginger-fresh',
    category: '채소',
    nutrition: { calories: 80, carb: 17.8, protein: 1.8, fat: 0.8, sodium: 13, sugar: 1.7 },
    description: '국내산 생강',
    brand: '농협',
    weight: '200g',
    rating: 4.5,
    reviewCount: 3210,
    isRocketDelivery: true
  },
  '홍고추': {
    id: 'prod-redpepper-fresh-200g',
    name: '홍고추 200g',
    price: 3480,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/06/10/01/7/redpepper-fresh.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/redpepper-fresh',
    category: '채소',
    nutrition: { calories: 40, carb: 8.8, protein: 2.0, fat: 0.4, sodium: 9, sugar: 5.3 },
    description: '신선한 홍고추',
    brand: '농협',
    weight: '200g (약 10개)',
    rating: 4.6,
    reviewCount: 4567,
    isRocketDelivery: true
  },
  '청양고추': {
    id: 'prod-chili-fresh-100g',
    name: '청양고추 100g',
    price: 2480,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/07/20/02/9/chili-fresh.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/chili-fresh',
    category: '채소',
    nutrition: { calories: 40, carb: 8.8, protein: 2.0, fat: 0.4, sodium: 9, sugar: 5.3 },
    description: '매운 청양고추',
    brand: '농협',
    weight: '100g (약 15개)',
    rating: 4.5,
    reviewCount: 3890,
    isRocketDelivery: true
  },

  // 🥛 액체류
  '맛술': {
    id: 'prod-mirim-500ml',
    name: '맛술 500ml',
    price: 3980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/08/05/03/4/mirim.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/mirim',
    category: '양념/소스',
    nutrition: { calories: 240, carb: 35, protein: 0, fat: 0, sodium: 5, sugar: 30 },
    description: '청정원 맛술',
    brand: '청정원',
    weight: '500ml',
    rating: 4.8,
    reviewCount: 7890,
    isRocketDelivery: true
  },
  '참치액': {
    id: 'prod-tuna-sauce-500ml',
    name: '참치액젓 500ml',
    price: 5980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/09/15/04/6/tuna-sauce.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/tuna-sauce',
    category: '양념/소스',
    nutrition: { calories: 25, carb: 2, protein: 4, fat: 0.1, sodium: 3000, sugar: 0 },
    description: '하선정 참치액젓',
    brand: '하선정',
    weight: '500ml',
    rating: 4.7,
    reviewCount: 5678,
    isRocketDelivery: true
  },
  '홍게액젓': {
    id: 'prod-crab-sauce-500ml',
    name: '홍게액젓 500ml',
    price: 6980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/10/25/05/8/crab-sauce.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/crab-sauce',
    category: '양념/소스',
    nutrition: { calories: 30, carb: 2.5, protein: 5, fat: 0.1, sodium: 3200, sugar: 0 },
    description: '동해안 홍게액젓',
    brand: '동해수산',
    weight: '500ml',
    rating: 4.6,
    reviewCount: 4321,
    isRocketDelivery: true
  },
  '굴소스': {
    id: 'prod-oyster-sauce-350g',
    name: '굴소스 350g',
    price: 4980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/30/06/2/oyster-sauce.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/oyster-sauce',
    category: '양념/소스',
    nutrition: { calories: 80, carb: 12, protein: 4, fat: 0.5, sodium: 2800, sugar: 8 },
    description: '이금기 프리미엄 굴소스',
    brand: '이금기',
    weight: '350g',
    rating: 4.8,
    reviewCount: 8901,
    isRocketDelivery: true
  },
  '들기름': {
    id: 'prod-perilla-oil-320ml',
    name: '들기름 320ml',
    price: 11900,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/12/15/07/4/perilla-oil.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/perilla-oil',
    category: '양념/소스',
    nutrition: { calories: 900, carb: 0, protein: 0, fat: 100, sodium: 0, sugar: 0 },
    description: '오뚜기 고소한 들기름',
    brand: '오뚜기',
    weight: '320ml',
    rating: 4.7,
    reviewCount: 6789,
    isRocketDelivery: true
  },
  '식용유': {
    id: 'prod-cooking-oil-1.8l',
    name: '콩기름 1.8L',
    price: 6980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/01/20/08/6/cooking-oil.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/cooking-oil',
    category: '양념/소스',
    nutrition: { calories: 900, carb: 0, protein: 0, fat: 100, sodium: 0, sugar: 0 },
    description: '백설 콩기름',
    brand: 'CJ제일제당',
    weight: '1.8L',
    rating: 4.8,
    reviewCount: 12345,
    isRocketDelivery: true
  },

  // 추가 양념
  '다시다': {
    id: 'prod-dashida-beef-300g',
    name: '소고기다시다 300g',
    price: 4980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/02/25/09/8/dashida-beef.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/dashida-beef',
    category: '양념/소스',
    nutrition: { calories: 200, carb: 30, protein: 10, fat: 5, sodium: 4000, sugar: 5 },
    description: 'CJ 소고기다시다',
    brand: 'CJ제일제당',
    weight: '300g',
    rating: 4.9,
    reviewCount: 15678,
    isRocketDelivery: true
  },
  '들깨가루': {
    id: 'prod-perilla-powder-200g',
    name: '들깨가루 200g',
    price: 5480,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/03/15/10/3/perilla-powder.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/perilla-powder',
    category: '양념/소스',
    nutrition: { calories: 500, carb: 20, protein: 20, fat: 40, sodium: 10, sugar: 1 },
    description: '국산 들깨가루',
    brand: '농협',
    weight: '200g',
    rating: 4.6,
    reviewCount: 4567,
    isRocketDelivery: true
  },
  '올리고당': {
    id: 'prod-oligosaccharide-700g',
    name: '올리고당 700g',
    price: 3980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/04/10/11/5/oligosaccharide.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/oligosaccharide',
    category: '양념/소스',
    nutrition: { calories: 200, carb: 50, protein: 0, fat: 0, sodium: 5, sugar: 40 },
    description: '백설 올리고당',
    brand: 'CJ제일제당',
    weight: '700g',
    rating: 4.8,
    reviewCount: 9012,
    isRocketDelivery: true
  },
  '매실액': {
    id: 'prod-plum-extract-500ml',
    name: '매실청 500ml',
    price: 7980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/20/12/7/plum-extract.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/plum-extract',
    category: '양념/소스',
    nutrition: { calories: 150, carb: 38, protein: 0, fat: 0, sodium: 2, sugar: 35 },
    description: '청정원 매실청',
    brand: '청정원',
    weight: '500ml',
    rating: 4.7,
    reviewCount: 6543,
    isRocketDelivery: true
  },

  // 기타
  '통깨': {
    id: 'prod-sesame-seed-200g',
    name: '통깨 200g',
    price: 4980,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/06/25/13/9/sesame-seed.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/sesame-seed',
    category: '양념/소스',
    nutrition: { calories: 573, carb: 23, protein: 18, fat: 50, sodium: 11, sugar: 0.3 },
    description: '국산 통깨',
    brand: '농협',
    weight: '200g',
    rating: 4.8,
    reviewCount: 5432,
    isRocketDelivery: true
  },
  '깨소금': {
    id: 'prod-sesame-salt-100g',
    name: '깨소금 100g',
    price: 3480,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/07/30/14/2/sesame-salt.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/sesame-salt',
    category: '양념/소스',
    nutrition: { calories: 470, carb: 15, protein: 15, fat: 40, sodium: 2000, sugar: 0.2 },
    description: '볶은 깨소금',
    brand: '오뚜기',
    weight: '100g',
    rating: 4.7,
    reviewCount: 3210,
    isRocketDelivery: true
  },
  '후추': {
    id: 'prod-blackpepper-50g',
    name: '후춧가루 50g',
    price: 2980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/08/15/15/4/blackpepper.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/blackpepper',
    category: '양념/소스',
    nutrition: { calories: 250, carb: 64, protein: 10, fat: 3.3, sodium: 20, sugar: 0.6 },
    description: '오뚜기 순후추',
    brand: '오뚜기',
    weight: '50g',
    rating: 4.8,
    reviewCount: 7890,
    isRocketDelivery: true
  },
  '통후추': {
    id: 'prod-blackpepper-whole-100g',
    name: '통후추 100g',
    price: 5980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/09/20/16/6/blackpepper-whole.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/blackpepper-whole',
    category: '양념/소스',
    nutrition: { calories: 250, carb: 64, protein: 10, fat: 3.3, sodium: 20, sugar: 0.6 },
    description: '통후추 홀',
    brand: '맥코믹',
    weight: '100g',
    rating: 4.7,
    reviewCount: 4567,
    isRocketDelivery: true
  },
  '김가루': {
    id: 'prod-seaweed-flake-50g',
    name: '김가루 50g',
    price: 3480,
    imageUrl: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/10/10/17/8/seaweed-flake.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/seaweed-flake',
    category: '김/해조류',
    nutrition: { calories: 188, carb: 44, protein: 35, fat: 2.5, sodium: 48, sugar: 0 },
    description: '조미김가루',
    brand: '동원',
    weight: '50g',
    rating: 4.6,
    reviewCount: 3456,
    isRocketDelivery: true
  },
  '다시마': {
    id: 'prod-kelp-dried-100g',
    name: '건다시마 100g',
    price: 4980,
    imageUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/11/15/18/3/kelp-dried.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/kelp-dried',
    category: '김/해조류',
    nutrition: { calories: 43, carb: 10, protein: 1.7, fat: 0.6, sodium: 230, sugar: 0 },
    description: '국물용 다시마',
    brand: '농협',
    weight: '100g',
    rating: 4.8,
    reviewCount: 5678,
    isRocketDelivery: true
  },

  // 기본 재료 (default)
  '물': {
    id: 'prod-water-2l-6',
    name: '삼다수 2L 6병',
    price: 4980,
    imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/12/20/19/5/water-samdasoo.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/water-samdasoo',
    category: '음료',
    nutrition: { calories: 0, carb: 0, protein: 0, fat: 0, sodium: 0, sugar: 0 },
    description: '제주 삼다수',
    brand: '제주삼다수',
    weight: '2L x 6병',
    rating: 4.9,
    reviewCount: 34567,
    isRocketDelivery: true
  },
  '생수': {
    id: 'prod-water-500ml-20',
    name: '삼다수 500ml 20병',
    price: 7980,
    imageUrl: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/01/10/20/7/water-500ml.jpg',
    coupangUrl: 'https://www.coupang.com/vp/products/water-500ml',
    category: '음료',
    nutrition: { calories: 0, carb: 0, protein: 0, fat: 0, sodium: 0, sugar: 0 },
    description: '제주 삼다수',
    brand: '제주삼다수',
    weight: '500ml x 20병',
    rating: 4.9,
    reviewCount: 23456,
    isRocketDelivery: true
  }
};

// 🔄 레시피별 재료 조회 함수
export const getRecipeIngredientsData = (recipeId: string): RecipeIngredient[] => {
  // 레시피 ID와 이름 모두 확인
  const recipeIdLower = recipeId.toLowerCase();
  console.log('🔍 recipeIngredients.ts - 레시피 ID:', recipeId);
  console.log('🔍 recipeIdLower:', recipeIdLower);
  
  // 레시피 이름도 함께 확인 (전역 레시피 데이터에서)
  // 임시로 ID에서 추출 가능한 패턴들을 확인
  
  // 🍳 레시피별 재료 매핑 (실제 CSV 데이터 기준)
  
  // 계란말이밥 (CSV: "계란말이밥")
  if (recipeIdLower.includes('계란말이밥') || recipeIdLower.includes('7014691') || recipeIdLower.includes('햄계란말이밥') || recipeIdLower.includes('계란') && recipeIdLower.includes('밥')) {
    console.log('✅ 계란말이밥 매칭됨');
    return [
      { product: ingredientProductMapping['계란'], quantity: 200, unit: 'g', isOptional: false }, // 4개
      { product: ingredientProductMapping['비엔나'], quantity: 75, unit: 'g', isOptional: false }, // 3개
      { product: ingredientProductMapping['마늘'], quantity: 5, unit: 'g', isOptional: false }, // 1개
      { product: ingredientProductMapping['당근'], quantity: 17, unit: 'g', isOptional: false }, // 1/6개
      { product: ingredientProductMapping['밥'], quantity: 210, unit: 'g', isOptional: false }, // 1공기
      { product: ingredientProductMapping['소금'], quantity: 1, unit: 'g', isOptional: false }
    ];
  }
  
  // 배추찜 (CSV: "배추찜")  
  if (recipeIdLower.includes('배추찜') || recipeIdLower.includes('7014692') || (recipeIdLower.includes('배추') && recipeIdLower.includes('찜'))) {
    console.log('✅ 배추찜 매칭됨');
    return [
      { product: ingredientProductMapping['알배기배추'], quantity: 500, unit: 'g', isOptional: false }, // 1통
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false }, // 2T
      { product: ingredientProductMapping['식초'], quantity: 5, unit: 'ml', isOptional: false }, // 1t
      { product: ingredientProductMapping['고춧가루'], quantity: 5, unit: 'g', isOptional: false }, // 1t
      { product: ingredientProductMapping['참기름'], quantity: 2.5, unit: 'ml', isOptional: false }, // 0.5t
      { product: ingredientProductMapping['깨소금'], quantity: 5, unit: 'g', isOptional: false }, // 1t
      { product: ingredientProductMapping['대파'], quantity: 50, unit: 'g', isOptional: false } // 1/2단
    ];
  }
  
  if (recipeIdLower.includes('어묵볶음') || recipeIdLower.includes('7016693') || (recipeIdLower.includes('어묵') && recipeIdLower.includes('볶음'))) {
    return [
      { product: ingredientProductMapping['사각어묵'], quantity: 100, unit: 'g', isOptional: false }, // 4장
      { product: ingredientProductMapping['대파'], quantity: 20, unit: 'g', isOptional: false }, // 1대
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false }, // 2큰술
      { product: ingredientProductMapping['물'], quantity: 30, unit: 'ml', isOptional: false }, // 2큰술
      { product: ingredientProductMapping['맛술'], quantity: 15, unit: 'ml', isOptional: false }, // 1큰술
      { product: ingredientProductMapping['설탕'], quantity: 15, unit: 'g', isOptional: false }, // 1큰술
      { product: ingredientProductMapping['참기름'], quantity: 15, unit: 'ml', isOptional: false }, // 1큰술
      { product: ingredientProductMapping['마늘'], quantity: 5, unit: 'g', isOptional: false }, // 1작은술
      { product: ingredientProductMapping['통깨'], quantity: 5, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('아보카도연어덮밥') || recipeIdLower.includes('7016694') || (recipeIdLower.includes('아보카도') && recipeIdLower.includes('연어'))) {
    return [
      { product: ingredientProductMapping['밥'], quantity: 210, unit: 'g', isOptional: false }, // 1공기
      { product: ingredientProductMapping['아보카도'], quantity: 80, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['훈제연어'], quantity: 70, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['양파'], quantity: 50, unit: 'g', isOptional: false }, // 1/4개
      { product: ingredientProductMapping['계란'], quantity: 20, unit: 'g', isOptional: false }, // 노른자 1개
      { product: ingredientProductMapping['생수'], quantity: 45, unit: 'ml', isOptional: false }, // 3스푼
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false }, // 2스푼
      { product: ingredientProductMapping['설탕'], quantity: 12, unit: 'g', isOptional: false }, // 1스푼
      { product: ingredientProductMapping['식초'], quantity: 15, unit: 'ml', isOptional: false } // 1스푼
    ];
  }
  
  if (recipeIdLower.includes('우삼겹숙주찜') || recipeIdLower.includes('7016695') || (recipeIdLower.includes('우삼겹') && recipeIdLower.includes('숙주'))) {
    return [
      { product: ingredientProductMapping['우삼겹'], quantity: 600, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['알배기배추'], quantity: 150, unit: 'g', isOptional: false }, // 잎 5장
      { product: ingredientProductMapping['숙주'], quantity: 200, unit: 'g', isOptional: false }, // 1봉
      { product: ingredientProductMapping['참치액'], quantity: 15, unit: 'ml', isOptional: false }, // 1T
      { product: ingredientProductMapping['소금'], quantity: 5, unit: 'g', isOptional: false }, // 1/3T
      { product: ingredientProductMapping['맛술'], quantity: 45, unit: 'ml', isOptional: false }, // 3T
      { product: ingredientProductMapping['후추'], quantity: 1, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('깻잎김치') || recipeIdLower.includes('7016696') || (recipeIdLower.includes('깻잎') && recipeIdLower.includes('김치'))) {
    return [
      { product: ingredientProductMapping['깻잎'], quantity: 180, unit: 'g', isOptional: false }, // 120장
      { product: ingredientProductMapping['당근'], quantity: 100, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['대파'], quantity: 100, unit: 'g', isOptional: false }, // 1단
      { product: ingredientProductMapping['양파'], quantity: 200, unit: 'g', isOptional: false }, // 1개
      { product: ingredientProductMapping['간장'], quantity: 300, unit: 'ml', isOptional: false }, // 20T
      { product: ingredientProductMapping['홍게액젓'], quantity: 90, unit: 'ml', isOptional: false }, // 6T
      { product: ingredientProductMapping['올리고당'], quantity: 60, unit: 'g', isOptional: false }, // 4T
      { product: ingredientProductMapping['매실액'], quantity: 90, unit: 'ml', isOptional: false }, // 6T
      { product: ingredientProductMapping['고춧가루'], quantity: 50, unit: 'g', isOptional: false }, // 10T
      { product: ingredientProductMapping['다진마늘'], quantity: 15, unit: 'g', isOptional: false }, // 1T
      { product: ingredientProductMapping['통깨'], quantity: 15, unit: 'g', isOptional: false } // 1T
    ];
  }
  
  if (recipeIdLower.includes('감자탕') || recipeIdLower.includes('돼지등뼈') || recipeIdLower.includes('7016697')) {
    return [
      { product: ingredientProductMapping['돼지등뼈'], quantity: 1000, unit: 'g', isOptional: false }, // 1kg
      { product: ingredientProductMapping['배추'], quantity: 300, unit: 'g', isOptional: false }, // 얼갈이 1단
      { product: ingredientProductMapping['대파'], quantity: 40, unit: 'g', isOptional: false }, // 2대
      { product: ingredientProductMapping['깻잎'], quantity: 4, unit: 'g', isOptional: false }, // 4장
      { product: ingredientProductMapping['감자'], quantity: 300, unit: 'g', isOptional: false }, // 2개
      { product: ingredientProductMapping['팽이버섯'], quantity: 150, unit: 'g', isOptional: false }, // 1봉
      { product: ingredientProductMapping['고추장'], quantity: 30, unit: 'g', isOptional: false }, // 2T
      { product: ingredientProductMapping['된장'], quantity: 90, unit: 'g', isOptional: false }, // 6T
      { product: ingredientProductMapping['다진마늘'], quantity: 45, unit: 'g', isOptional: false }, // 3T
      { product: ingredientProductMapping['생강'], quantity: 15, unit: 'g', isOptional: false }, // 1T
      { product: ingredientProductMapping['고춧가루'], quantity: 20, unit: 'g', isOptional: false }, // 4T
      { product: ingredientProductMapping['들기름'], quantity: 90, unit: 'ml', isOptional: false },
      { product: ingredientProductMapping['소금'], quantity: 45, unit: 'g', isOptional: false } // 3T
    ];
  }
  
  if (recipeIdLower.includes('떡볶이') || recipeIdLower.includes('7016698')) {
    return [
      { product: ingredientProductMapping['떡볶이떡'], quantity: 1000, unit: 'g', isOptional: false }, // 1kg
      { product: ingredientProductMapping['다진마늘'], quantity: 7.5, unit: 'g', isOptional: false }, // 1/2T
      { product: ingredientProductMapping['대파'], quantity: 50, unit: 'g', isOptional: false }, // 1/2단
      { product: ingredientProductMapping['소금'], quantity: 5, unit: 'g', isOptional: false }, // 1/3T
      { product: ingredientProductMapping['어묵'], quantity: 100, unit: 'g', isOptional: false }, // 4장
      { product: ingredientProductMapping['물'], quantity: 600, unit: 'ml', isOptional: false },
      { product: ingredientProductMapping['고춧가루'], quantity: 20, unit: 'g', isOptional: false }, // 4T
      { product: ingredientProductMapping['설탕'], quantity: 45, unit: 'g', isOptional: false }, // 3T
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false }, // 2T
      { product: ingredientProductMapping['굴소스'], quantity: 30, unit: 'g', isOptional: false }, // 2T
      { product: ingredientProductMapping['고추장'], quantity: 30, unit: 'g', isOptional: false }, // 2T
      { product: ingredientProductMapping['식용유'], quantity: 15, unit: 'ml', isOptional: false }, // 1T
      { product: ingredientProductMapping['후추'], quantity: 2, unit: 'g', isOptional: false } // 1t
    ];
  }
  
  if (recipeIdLower.includes('땅콩마요잼') || recipeIdLower.includes('7016699') || (recipeIdLower.includes('땅콩') && recipeIdLower.includes('마요'))) {
    return [
      { product: ingredientProductMapping['땅콩버터'], quantity: 45, unit: 'g', isOptional: false }, // 3T
      { product: ingredientProductMapping['우유'], quantity: 100, unit: 'ml', isOptional: false },
      { product: ingredientProductMapping['설탕'], quantity: 60, unit: 'g', isOptional: false }, // 4T
      { product: ingredientProductMapping['마요네즈'], quantity: 45, unit: 'g', isOptional: false } // 3T
    ];
  }
  
  if (recipeIdLower.includes('소고기떡국') || recipeIdLower.includes('7016813') || (recipeIdLower.includes('소고기') && recipeIdLower.includes('떡국'))) {
    return [
      { product: ingredientProductMapping['떡볶이떡'], quantity: 400, unit: 'g', isOptional: false }, // 떡국떡
      { product: ingredientProductMapping['소고기'], quantity: 100, unit: 'g', isOptional: false }, // 다진 소고기
      { product: ingredientProductMapping['물'], quantity: 800, unit: 'ml', isOptional: false }, // 멸치육수
      { product: ingredientProductMapping['대파'], quantity: 30, unit: 'g', isOptional: false }, // 1/3대
      { product: ingredientProductMapping['계란'], quantity: 100, unit: 'g', isOptional: false }, // 2개
      { product: ingredientProductMapping['참기름'], quantity: 15, unit: 'ml', isOptional: false }, // 1T
      { product: ingredientProductMapping['간장'], quantity: 15, unit: 'ml', isOptional: false }, // 1T
      { product: ingredientProductMapping['다진마늘'], quantity: 5, unit: 'g', isOptional: false }, // 1t
      { product: ingredientProductMapping['소금'], quantity: 3, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['김가루'], quantity: 2, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('된장수육') || recipeIdLower.includes('7016814') || (recipeIdLower.includes('된장') && recipeIdLower.includes('수육'))) {
    return [
      { product: ingredientProductMapping['돼지고기'], quantity: 500, unit: 'g', isOptional: false }, // 수육용 삼겹살
      { product: ingredientProductMapping['된장'], quantity: 22.5, unit: 'g', isOptional: false }, // 1.5큰술
      { product: ingredientProductMapping['맛술'], quantity: 60, unit: 'ml', isOptional: false } // 술 4큰술
    ];
  }
  
  if (recipeIdLower.includes('우거지감자탕') || recipeIdLower.includes('7016815') || (recipeIdLower.includes('우거지') && recipeIdLower.includes('감자탕'))) {
    return [
      { product: ingredientProductMapping['돼지등뼈'], quantity: 1500, unit: 'g', isOptional: false }, // 1.5kg
      { product: ingredientProductMapping['양파'], quantity: 100, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['감자'], quantity: 150, unit: 'g', isOptional: false }, // 1개
      { product: ingredientProductMapping['대파'], quantity: 20, unit: 'g', isOptional: false }, // 1대
      { product: ingredientProductMapping['알배기배추'], quantity: 250, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['청양고추'], quantity: 10, unit: 'g', isOptional: false }, // 2개
      { product: ingredientProductMapping['깻잎'], quantity: 15, unit: 'g', isOptional: false }, // 10~15장
      { product: ingredientProductMapping['된장'], quantity: 30, unit: 'g', isOptional: false }, // 2T
      { product: ingredientProductMapping['고추장'], quantity: 30, unit: 'g', isOptional: false }, // 2T
      { product: ingredientProductMapping['다진마늘'], quantity: 15, unit: 'g', isOptional: false }, // 1T
      { product: ingredientProductMapping['간장'], quantity: 45, unit: 'ml', isOptional: false }, // 3T
      { product: ingredientProductMapping['고춧가루'], quantity: 15, unit: 'g', isOptional: false }, // 3T
      { product: ingredientProductMapping['홍게액젓'], quantity: 45, unit: 'ml', isOptional: false }, // 액젓 3T
      { product: ingredientProductMapping['생강'], quantity: 5, unit: 'g', isOptional: false }, // 1t
      { product: ingredientProductMapping['다시다'], quantity: 5, unit: 'g', isOptional: false }, // 1t
      { product: ingredientProductMapping['들깨가루'], quantity: 15, unit: 'g', isOptional: false } // 3T
    ];
  }
  
  if (recipeIdLower.includes('만두전골') || recipeIdLower.includes('7016816') || (recipeIdLower.includes('만두') && recipeIdLower.includes('전골'))) {
    return [
      { product: ingredientProductMapping['만두'], quantity: 300, unit: 'g', isOptional: false }, // 12개
      { product: ingredientProductMapping['청경채'], quantity: 90, unit: 'g', isOptional: false }, // 3개
      { product: ingredientProductMapping['양파'], quantity: 100, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['대파'], quantity: 50, unit: 'g', isOptional: false }, // 1/2개
      { product: ingredientProductMapping['느타리버섯'], quantity: 100, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['홍고추'], quantity: 10, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['다시다'], quantity: 10, unit: 'g', isOptional: false }, // 코인육수 2개
      { product: ingredientProductMapping['다시마'], quantity: 8, unit: 'g', isOptional: false }, // 4개
      { product: ingredientProductMapping['물'], quantity: 1000, unit: 'ml', isOptional: false }, // 1L
      { product: ingredientProductMapping['고춧가루'], quantity: 5, unit: 'g', isOptional: false }, // 1T
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false }, // 2T
      { product: ingredientProductMapping['참치액'], quantity: 15, unit: 'ml', isOptional: false }, // 1T
      { product: ingredientProductMapping['다진마늘'], quantity: 15, unit: 'g', isOptional: false }, // 1T
      { product: ingredientProductMapping['통후추'], quantity: 2, unit: 'g', isOptional: false } // 20바퀴
    ];
  }
  
  // 🔍 추가 키워드 기반 매칭 (더 포괄적)
  
  // 일반적인 한식 패턴들
  if (recipeIdLower.includes('김치') || recipeIdLower.includes('깻잎')) {
    console.log('✅ 김치/깻잎 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['깻잎'], quantity: 180, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['고춧가루'], quantity: 10, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['간장'], quantity: 30, unit: 'ml', isOptional: false },
      { product: ingredientProductMapping['마늘'], quantity: 10, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('볶음') || recipeIdLower.includes('어묵')) {
    console.log('✅ 볶음/어묵 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['어묵'], quantity: 200, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['대파'], quantity: 30, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['간장'], quantity: 20, unit: 'ml', isOptional: false },
      { product: ingredientProductMapping['참기름'], quantity: 10, unit: 'ml', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('덮밥') || recipeIdLower.includes('아보카도') || recipeIdLower.includes('연어')) {
    console.log('✅ 덮밥/아보카도/연어 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['밥'], quantity: 210, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['아보카도'], quantity: 80, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['훈제연어'], quantity: 70, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['계란'], quantity: 20, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('소고기') || recipeIdLower.includes('우삼겹') || recipeIdLower.includes('숙주')) {
    console.log('✅ 소고기/우삼겹/숙주 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['우삼겹'], quantity: 300, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['숙주'], quantity: 150, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['대파'], quantity: 20, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['마늘'], quantity: 10, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('떡볶이') || recipeIdLower.includes('떡')) {
    console.log('✅ 떡볶이/떡 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['떡볶이떡'], quantity: 300, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['고춧가루'], quantity: 10, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['고추장'], quantity: 20, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['설탕'], quantity: 15, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['어묵'], quantity: 100, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('감자탕') || recipeIdLower.includes('돼지등뼈') || recipeIdLower.includes('돼지')) {
    console.log('✅ 감자탕/돼지등뼈 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['돼지등뼈'], quantity: 800, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['감자'], quantity: 200, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['된장'], quantity: 30, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['고추장'], quantity: 20, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['배추'], quantity: 200, unit: 'g', isOptional: false }
    ];
  }
  
  if (recipeIdLower.includes('만두') || recipeIdLower.includes('전골')) {
    console.log('✅ 만두/전골 레시피 매칭됨');
    return [
      { product: ingredientProductMapping['만두'], quantity: 300, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['청경채'], quantity: 90, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['느타리버섯'], quantity: 100, unit: 'g', isOptional: false },
      { product: ingredientProductMapping['대파'], quantity: 50, unit: 'g', isOptional: false }
    ];
  }
  
  // 기본 재료 (레시피를 찾을 수 없는 경우)
  console.log('⚠️ 매칭되는 레시피를 찾을 수 없어 기본 재료 반환');
  return [
    { product: ingredientProductMapping['계란'], quantity: 50, unit: 'g', isOptional: false },
    { product: ingredientProductMapping['밥'], quantity: 210, unit: 'g', isOptional: false },
    { product: ingredientProductMapping['양파'], quantity: 50, unit: 'g', isOptional: false },
    { product: ingredientProductMapping['간장'], quantity: 15, unit: 'ml', isOptional: false },
    { product: ingredientProductMapping['참기름'], quantity: 5, unit: 'ml', isOptional: false }
  ];
};
