import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserInput, RecommendationResult, CoupangProduct, UserProfile, OnboardingStep, CalorieCalculation } from '../types';

interface AppContextType {
  // 기존 기능
  userInput: UserInput;
  setUserInput: (input: UserInput) => void;
  recommendationResult: RecommendationResult | null;
  setRecommendationResult: (result: RecommendationResult | null) => void;
  selectedProduct: CoupangProduct | null;
  setSelectedProduct: (product: CoupangProduct | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 새로운 온보딩 기능
  userProfile: Partial<UserProfile>;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  updateUserProfile: (update: Partial<UserProfile>) => void;
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  completedSteps: OnboardingStep[];
  setCompletedSteps: (steps: OnboardingStep[]) => void;
  calorieCalculation: CalorieCalculation | null;
  setCalorieCalculation: (calculation: CalorieCalculation | null) => void;
  
  // 온보딩 완료 여부
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (complete: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // 기존 상태
  const [userInput, setUserInput] = useState<UserInput>({
    budget: 170000, // 일주일 식비 기본값 (현실적 표준형)
    nutrients: {
      carb: 50,
      protein: 25,
      fat: 25,
    },
  });

  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<CoupangProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 새로운 온보딩 상태 (MVP용 기본값 설정)
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    budget: 170000, // 일주일 식비 기본값 (17만원/주, 현실적 표준형)
    goal: 'maintenance', // 기본 목표 설정
    // 기본 정보 기본값 (사용자가 쉽게 시작할 수 있도록)
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 'moderately_active'
  });
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('goal');
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [calorieCalculation, setCalorieCalculation] = useState<CalorieCalculation | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // 사용자 프로필 업데이트 헬퍼 함수
  const updateUserProfile = (update: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...update }));
  };

  const value: AppContextType = {
    // 기존 기능
    userInput,
    setUserInput,
    recommendationResult,
    setRecommendationResult,
    selectedProduct,
    setSelectedProduct,
    isLoading,
    setIsLoading,
    
    // 새로운 온보딩 기능
    userProfile,
    setUserProfile,
    updateUserProfile,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    calorieCalculation,
    setCalorieCalculation,
    isOnboardingComplete,
    setIsOnboardingComplete,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
