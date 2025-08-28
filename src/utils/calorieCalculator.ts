import { UserProfile, CalorieCalculation, NutrientRatios } from '../types';

/**
 * BMR (기초대사율) 계산 - Mifflin-St Jeor 공식 사용
 * 가장 정확한 것으로 알려진 공식
 */
export const calculateBMR = (profile: UserProfile): number => {
  const { gender, weight, height, age } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * TDEE (총 일일 에너지 소모량) 계산
 * BMR에 활동 수준을 곱해서 계산
 */
export const calculateTDEE = (bmr: number, activityLevel: UserProfile['activityLevel']): number => {
  const activityMultipliers = {
    sedentary: 1.2,           // 운동하지 않음, 사무직
    lightly_active: 1.375,    // 가벼운 운동 (주 1-3회)
    moderately_active: 1.55,  // 중간 강도 운동 (주 3-5회)
    very_active: 1.725,       // 고강도 운동 (주 6-7회)
    extremely_active: 1.9     // 매우 고강도 운동, 육체 노동
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * 목적에 따른 목표 칼로리 계산
 */
export const calculateTargetCalories = (tdee: number, goal: UserProfile['goal']): number => {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee * 0.8); // 20% 감소 (주당 0.5kg 감량)
    case 'maintenance':
      return tdee; // 현재 체중 유지
    case 'muscle_gain':
      return Math.round(tdee * 1.15); // 15% 증가 (근육 성장)
    default:
      return tdee;
  }
};

/**
 * 목적별 최적 영양소 비율 계산
 * 과학적 근거 기반
 */
export const calculateOptimalMacros = (goal: UserProfile['goal']): NutrientRatios => {
  const macroPresets = {
    weight_loss: {
      carb: 35,    // 탄수화물 낮춤, 포만감 유지
      protein: 40, // 단백질 높임, 근손실 방지
      fat: 25      // 적정 지방
    },
    maintenance: {
      carb: 45,    // 균형잡힌 비율
      protein: 25, // 표준 단백질
      fat: 30      // 표준 지방
    },
    muscle_gain: {
      carb: 50,    // 탄수화물 높임, 에너지 공급
      protein: 30, // 단백질 높임, 근육 합성
      fat: 20      // 지방 낮춤
    }
  };
  
  return macroPresets[goal];
};

/**
 * 전체 칼로리 계산 및 영양소 비율 도출
 */
export const calculateCompleteNutrition = (profile: UserProfile): CalorieCalculation => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, profile.goal);
  const macros = calculateOptimalMacros(profile.goal);
  
  return {
    bmr,
    tdee,
    targetCalories,
    macros
  };
};

/**
 * 사용자 친화적인 목표 설명
 */
export const getGoalDescription = (goal: UserProfile['goal']): string => {
  const descriptions = {
    weight_loss: '건강한 체중 감량을 위해 칼로리를 줄이고 단백질을 늘렸어요.',
    maintenance: '현재 체중을 유지하면서 균형잡힌 영양을 제공해요.',
    muscle_gain: '근육 성장을 위해 충분한 칼로리와 단백질을 확보했어요.'
  };
  
  return descriptions[goal];
};

/**
 * 활동 수준별 설명
 */
export const getActivityDescription = (activityLevel: UserProfile['activityLevel']): string => {
  const descriptions = {
    sedentary: '주로 앉아서 일하고 운동을 거의 하지 않음',
    lightly_active: '가벼운 운동이나 스포츠 (주 1-3회)',
    moderately_active: '중간 강도 운동이나 스포츠 (주 3-5회)',
    very_active: '고강도 운동이나 스포츠 (주 6-7회)',
    extremely_active: '매우 고강도 운동, 육체적 직업 또는 하루 2회 운동'
  };
  
  return descriptions[activityLevel];
};

/**
 * BMI 계산 및 분류
 */
export const calculateBMI = (weight: number, height: number): { bmi: number; category: string; description: string } => {
  const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  
  let category: string;
  let description: string;
  
  if (bmi < 18.5) {
    category = 'underweight';
    description = '저체중';
  } else if (bmi < 23) {
    category = 'normal';
    description = '정상체중';
  } else if (bmi < 25) {
    category = 'overweight';
    description = '과체중';
  } else {
    category = 'obese';
    description = '비만';
  }
  
  return { bmi, category, description };
};

/**
 * 목표 체중 제안
 */
export const suggestTargetWeight = (height: number, goal: UserProfile['goal']): number => {
  const idealBMI = 22; // 이상적인 BMI
  const idealWeight = (idealBMI * Math.pow(height / 100, 2));
  
  switch (goal) {
    case 'weight_loss':
      return Math.round(idealWeight);
    case 'maintenance':
      return 0; // 현재 체중 유지
    case 'muscle_gain':
      return Math.round(idealWeight + 3); // 근육량 고려 3kg 추가
    default:
      return Math.round(idealWeight);
  }
};
