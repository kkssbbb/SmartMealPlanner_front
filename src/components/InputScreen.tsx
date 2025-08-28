import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Button,
  HStack,
  useToast,
  Spinner,
  Box,
  Text,
  Heading,

  SimpleGrid,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowForwardIcon, StarIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import { useAppContext } from '../context/AppContext';
import { getRecommendationMessage } from '../data/mockProducts';
import { fastRecommendationEngine } from '../utils/fastRecommendationEngine';
import { recipeLoader } from '../data/recipeData'; // 캐시 클리어용
import { optimizedCSVProcessor } from '../utils/optimizedCSVProcessor'; // CSV 캐시 클리어용
import { RecommendationResult, UserProfile, PersonalizedNutritionTargets } from '../types';
import { calculateCompleteNutrition } from '../utils/calorieCalculator';
import Layout from './Layout/Layout';

// 온보딩 컴포넌트들 (간소화)
import ProgressIndicator from './Onboarding/ProgressIndicator';
import GoalSelection from './Onboarding/GoalSelection';
import BudgetSelection from './Onboarding/BudgetSelection';
import BasicInfo from './Onboarding/BasicInfo';



// 🎯 목표 진행도 계산 헬퍼 함수
const calculateGoalProgress = (userProfile: Partial<UserProfile>, targets: PersonalizedNutritionTargets) => {
  const { goal, weight } = userProfile;
  
  const progressMessages = {
    weight_loss: {
      message: `${targets.targetCalories}kcal 식단으로 건강한 체중감량 진행중!`,
      percentage: 0, // 실제로는 시작 체중 대비 현재 진행률
      nextMilestone: '첫 1kg 감량까지 약 2주 예상'
    },
    muscle_gain: {
      message: `일일 단백질 ${Math.round(targets.dailyProteinNeeds)}g로 근성장 최적화!`,
      percentage: 0,
      nextMilestone: '첫 근력 향상까지 약 4주 예상'
    },
    maintenance: {
      message: `${weight}kg 건강 체중 유지를 위한 균형 식단!`,
      percentage: 100, // 유지 목표는 100%
      nextMilestone: '꾸준한 건강 관리가 목표!'
    }
  };

  return progressMessages[goal || 'maintenance'];
};

// 애니메이션 키프레임
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;



const InputScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
    // 기존 상태
    setUserInput,
    setRecommendationResult,
    isLoading,
    setIsLoading,
    // 새로운 온보딩 상태
    userProfile,
    updateUserProfile,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    calorieCalculation,
    setCalorieCalculation,

    setIsOnboardingComplete,
  } = useAppContext();

  // 히어로 섹션 상태
  const [showHero, setShowHero] = useState(true);
  const [userProblems, setUserProblems] = useState([
    { problem: "매번 뭘 먹을지 고민돼요 😰", checked: true },
    { problem: "재료 구매가 너무 번거로워요 🛒", checked: true },
    { problem: "예산 관리가 어려워요 💸", checked: true }
  ]);

  // 정적 메시지 (타이핑 효과 제거)
  const mainMessage = "매번 식단 할 때 뭘 먹을지 고민되고, 재료 구매가 번거로우셨나요?";
  const subMessage = "예산 내에서 목표에 맞는 레시피를 추천하고 재료를 쿠팡에서 바로 주문하세요.";

  // 색상 모드
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, teal.50, green.50)',
    'linear(to-br, blue.900, teal.900, green.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  // 인터랙티브 기능들
  const handleProblemCheck = (index: number) => {
    setUserProblems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleStartJourney = () => {
    setShowHero(false);
    setCurrentStep('goal');
  };



  // 단계별 필수 조건 체크 (간소화 + 디버깅)
  const isStepValid = () => {
    switch (currentStep) {
      case 'goal':
        return userProfile.goal !== undefined;
      case 'budget':
        return userProfile.budget && userProfile.budget > 0;
      case 'basic_info':
        // MVP 테스트용: 기본값이 있으면 통과 (더 관대한 검증)
        const hasGender = userProfile.gender;
        const hasBasicInfo = userProfile.height && userProfile.weight && userProfile.age;
        const hasActivity = userProfile.activityLevel;
        
        const isValid = hasGender && hasBasicInfo && hasActivity;
        
        // 디버깅용 콘솔 로그
        console.log('BasicInfo 검증 (MVP):', {
          gender: userProfile.gender,
          height: userProfile.height,
          weight: userProfile.weight,
          age: userProfile.age,
          activityLevel: userProfile.activityLevel,
          hasGender,
          hasBasicInfo,
          hasActivity,
          isValid
        });
        
        return isValid;
      default:
        return false;
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (!isStepValid()) {
      toast({
        title: '정보를 입력해주세요',
        description: '다음 단계로 진행하기 위해 필요한 정보를 모두 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 현재 단계를 완료된 단계에 추가
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // 다음 단계로 이동 (간소화)
    const stepOrder: (typeof currentStep)[] = ['goal', 'budget', 'basic_info'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  // 이전 단계로 이동 (간소화)
  const handlePrevious = () => {
    const stepOrder: (typeof currentStep)[] = ['goal', 'budget', 'basic_info'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  // 칼로리 계산
  useEffect(() => {
    if (userProfile.gender && userProfile.height && userProfile.weight && 
        userProfile.age && userProfile.goal && userProfile.activityLevel) {
      const calculation = calculateCompleteNutrition(userProfile as UserProfile);
      setCalorieCalculation(calculation);
    }
  }, [userProfile, setCalorieCalculation]);

  // 온보딩 완료 및 식단 추천
  const handleComplete = async () => {
    // 칼로리 계산이 안되어 있으면 자동 계산
    let finalCalorieCalculation = calorieCalculation;
    if (!finalCalorieCalculation && userProfile.gender && userProfile.height && 
        userProfile.weight && userProfile.age && userProfile.goal && userProfile.activityLevel) {
      finalCalorieCalculation = calculateCompleteNutrition(userProfile as UserProfile);
      setCalorieCalculation(finalCalorieCalculation);
    }

    if (!finalCalorieCalculation) {
      toast({
        title: '정보 부족',
        description: '칼로리 계산을 위한 정보가 부족합니다. 모든 정보를 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // 온보딩 완료 표시
      setIsOnboardingComplete(true);
      
      // 기존 UserInput 형식으로 변환하여 저장
      const inputData = {
        budget: userProfile.budget!, // 사용자가 설정한 예산 사용
        nutrients: finalCalorieCalculation.macros,
      };
      setUserInput(inputData);

      // 🚀 초고속 로딩 (더미 지연 제거)
      // await new Promise(resolve => setTimeout(resolve, 500)); // 제거

      // 사용자 선호도와 히스토리 시뮬레이션 (실제로는 localStorage나 DB에서 가져옴)
      const preferences = {
        cookingTime: userProfile.goal === 'weight_loss' ? 'quick' as const : 'normal' as const,
        difficulty: 'easy' as const,
        priceRange: inputData.budget > 400000 ? 'premium' as const : 
                   inputData.budget > 250000 ? 'standard' as const : 'budget' as const
      };

      const history = {
        purchasedProducts: [], // 실제로는 구매 이력
        cookedRecipes: [],     // 실제로는 조리 이력
        favoriteIngredients: [] // 실제로는 선호 재료
      };

      // 🚀 초고속 개인맞춤 추천 실행!
      console.log('⚡ 초고속 추천 엔진 사용');
      
      // 🔥 모든 캐시 클리어 (문제 해결용)
      fastRecommendationEngine.clearCache();
      recipeLoader.clearCache(); // 레시피 캐시도 클리어!
      optimizedCSVProcessor.clearCache(); // CSV 캐시도 클리어!
      console.log('🧹 모든 캐시 클리어 완료');

      // 🔍 시스템 진단 실행
      await recipeLoader.diagnoseCacheStatus();
      
      const fastResult = await fastRecommendationEngine.generateFastRecommendations(
        userProfile as UserProfile,
        finalCalorieCalculation,
        inputData.budget
      );
      
      // 💰 호환성을 위해 기존 형식으로 변환
      const personalizedResult = {
        recommendedRecipes: fastResult.recommendedRecipes,
        budgetAnalysis: fastResult.budgetAnalysis,
        personalizedMessage: `🎯 ${userProfile.goal === 'weight_loss' ? '체중 감량' : 
                                 userProfile.goal === 'muscle_gain' ? '근육 증가' : '체중 유지'} 목표에 맞는 맞춤 레시피를 추천드립니다!`,
        nutritionTargets: {
          targetCalories: finalCalorieCalculation.tdee,
          macroGrams: finalCalorieCalculation.macros,
          dailyTargets: {
            calories: finalCalorieCalculation.tdee,
            protein: finalCalorieCalculation.macros.protein,
            carb: finalCalorieCalculation.macros.carb,
            fat: finalCalorieCalculation.macros.fat
          },
          dailyProteinNeeds: finalCalorieCalculation.macros.protein,
          macroPercentages: {
            protein: 25,
            carb: 50,
            fat: 25
          }
        },
        recommendedProducts: [], // 빠른 로딩을 위해 일단 빈 배열
        context: {
          userProfile: userProfile as UserProfile,
          calorieCalculation,
          currentTime: new Date(),
          preferences,
          history
        }
      };



      // 🍳 레시피 기반 정확한 예산 계산!
      const recommendedRecipeList = personalizedResult.recommendedRecipes || [];
      
      // 🚀 초고속 레시피 처리 (복잡한 계산 최소화)
      const meals: any[] = recommendedRecipeList.slice(0, 3).map((recipe, index) => {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealType = mealTypes[index] || 'breakfast';
        
        // 빠른 추정치 사용 (실제 재료 계산 생략)
        const estimatedCost = personalizedResult.budgetAnalysis.costBreakdown[index]?.monthlyCost || 45000;
        const estimatedNutrition = {
          calories: 400 + index * 50,
          protein: 25 + index * 5,
          carb: 45 + index * 10,
          fat: 15 + index * 3
        };

        return {
          id: mealType,
          recipe: recipe,
          products: [{ // 간단한 더미 데이터
            name: recipe.name + ' 재료 세트',
            price: estimatedCost,
            usedQuantity: 1,
            costPerRecipe: estimatedCost / 30,
            monthlyNeeded: 1
          }],
          totalPrice: estimatedCost,
          totalNutrition: estimatedNutrition,
          mealType: mealType,
          servings: 30,
        };
      });

      // 🚀 빈 슬롯을 간단히 채우기 (복잡한 처리 생략)
      while (meals.length < 3) {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealType = mealTypes[meals.length];
        
        // 기본 더미 레시피 (빠른 로딩)
        meals.push({
          id: mealType,
          recipe: {
            id: `default-${mealType}`,
            name: `추천 ${mealType === 'breakfast' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'} 레시피`,
            description: '개인 맞춤 레시피를 준비 중입니다.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400'
          },
          products: [],
          totalPrice: 45000,
          totalNutrition: { calories: 400, protein: 25, carb: 45, fat: 15 },
          mealType: mealType,
          servings: 30,
        });
      }

      // 💰 예산 분석 결과 활용 (정확한 예산 계산)
      const totalBudgetUsed = personalizedResult.budgetAnalysis.totalEstimatedCost;
      const budgetRemaining = inputData.budget - totalBudgetUsed;

      // 🎯 개인맞춤 RecommendationResult 생성
      const result: RecommendationResult = {
        meals,
        totalBudgetUsed,
        budgetRemaining,
        nutritionBalance: finalCalorieCalculation.macros,
        message: personalizedResult.personalizedMessage, // 🌟 개인맞춤 메시지!
        nutritionTargets: personalizedResult.nutritionTargets, // 🎯 개인 영양 목표
        recommendedRecipes: personalizedResult.recommendedRecipes, // 🍳 맞춤 레시피
        userInsights: {
          dailyCalorieGoal: personalizedResult.nutritionTargets.targetCalories,
          proteinNeeds: personalizedResult.nutritionTargets.dailyProteinNeeds,
          budgetPerMeal: Math.round(inputData.budget / 7 / 3), // 끼니당 예산 (일주일 기준)
          goalProgress: calculateGoalProgress(userProfile, personalizedResult.nutritionTargets as any)
        }
      };

      setRecommendationResult(result);

      toast({
        title: '맞춤 식단 완성! 🎉',
        description: getRecommendationMessage(userProfile.goal!),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 추천 결과 페이지로 이동
      navigate('/recommendations');

    } catch (error) {
      toast({
        title: '오류 발생',
        description: '식단 추천 중 문제가 발생했습니다. 다시 시도해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 단계에 맞는 컴포넌트 렌더링 (간소화)
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'goal':
        return (
          <GoalSelection
            selectedGoal={userProfile.goal}
            onGoalSelect={(goal) => updateUserProfile({ goal })}
          />
        );
      case 'budget':
        return (
          <BudgetSelection
            selectedBudget={userProfile.budget || 170000}
            onBudgetSelect={(budget) => updateUserProfile({ budget })}
          />
        );
      case 'basic_info':
        return (
          <BasicInfo
            userProfile={userProfile}
            onProfileUpdate={(update) => updateUserProfile(update)}
          />
        );
      default:
        return null;
    }
  };

  const stepOrder: (typeof currentStep)[] = ['goal', 'budget', 'basic_info'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === stepOrder.length - 1;

  // 히어로 섹션 컴포넌트
  const HeroSection = () => (
    <Box 
      bgGradient={bgGradient}
      minH="100vh"
      display="flex"
      alignItems="center"
      animation={`${fadeInUp} 1s ease-out`}
    >
      <Container maxW="6xl" py={{ base: 12, md: 20 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="center" textAlign="center">
          {/* 메인 헤딩 - 타이핑 효과 */}
          <Box>
            <Heading 
              size={{ base: "lg", md: "xl", lg: "2xl" }}
              color="gray.800"
              lineHeight="shorter"
              mb={4}
            >
              {mainMessage}
            </Heading>
            
            {/* 서브 메시지 */}
            <Text 
              fontSize={{ base: "md", md: "lg" }}
              color="gray.600"
              maxW="2xl"
              mx="auto"
              animation={`${fadeInUp} 0.8s ease-out`}
            >
              {subMessage}
            </Text>
          </Box>

          {/* 문제 체크리스트 */}
            <VStack spacing={4} w="full" maxW="md" animation={`${fadeInUp} 0.8s ease-out 0.5s both`}>
              <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                혹시 이런 고민 있으셨나요? 🤔
              </Text>
              
              {userProblems.map((item, index) => (
                <Flex
                  key={index}
                  as="button"
                  onClick={() => handleProblemCheck(index)}
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  border="2px"
                  borderColor={item.checked ? "green.400" : "gray.200"}
                  w="full"
                  align="center"
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "translateY(-2px)", 
                    shadow: "lg",
                    borderColor: item.checked ? "green.500" : "blue.300"
                  }}
                  cursor="pointer"
                >
                  <Icon
                    as={CheckCircleIcon}
                    color={item.checked ? "green.500" : "gray.300"}
                    boxSize={6}
                    mr={3}
                    transition="all 0.3s ease"
                  />
                  <Text 
                    flex={1} 
                    textAlign="left"
                    color={item.checked ? "green.700" : textColor}
                    fontWeight={item.checked ? "semibold" : "normal"}
                  >
                    {item.problem}
                  </Text>
                </Flex>
              ))}
            </VStack>

          {/* CTA 버튼 */}
            <VStack spacing={4} animation={`${fadeInUp} 0.8s ease-out 0.8s both`}>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                그렇다면 지금 바로 해결해보세요! ✨
              </Text>
              
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<ArrowForwardIcon />}
                onClick={handleStartJourney}
                px={8}
                py={6}
                fontSize="lg"
                animation={`${pulse} 2s infinite`}
                _hover={{
                  transform: "scale(1.05)",
                  shadow: "xl"
                }}
                transition="all 0.3s ease"
              >
                3분만에 맞춤 식단 만들기
              </Button>
              
              <HStack spacing={2} color="gray.500">
                <StarIcon boxSize={4} color="yellow.400" />
                <Text fontSize="sm">이미 1,000명이 식단 고민을 해결했어요!</Text>
                <StarIcon boxSize={4} color="yellow.400" />
              </HStack>
            </VStack>

          {/* 떠다니는 이모지들 */}
          <SimpleGrid columns={{ base: 3, md: 6 }} spacing={8} w="full" maxW="2xl" opacity={0.6}>
            {['🥗', '🍲', '🥘', '🍱', '🥙', '🍜'].map((emoji, index) => (
              <Text
                key={index}
                fontSize={{ base: "2xl", md: "3xl" }}
                animation={`${float} ${3 + index * 0.5}s ease-in-out infinite`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </Text>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );

  return (
    <Layout>
      {showHero ? (
        <HeroSection />
      ) : (
        <Container maxW={{ base: "100%", sm: "container.sm", md: "4xl" }} px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            {/* 진행 상황 표시 */}
            <ProgressIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />

            {/* 현재 단계 컴포넌트 */}
            {renderCurrentStep()}

          {/* 네비게이션 버튼 - 모바일 최적화 */}
          <VStack spacing={{ base: 3, md: 0 }} w="full" pt={{ base: 6, md: 4 }}>
            {/* 데스크톱 레이아웃 */}
            <HStack justify="space-between" w="full" display={{ base: "none", md: "flex" }}>
              <Button
                variant="outline"
                onClick={handlePrevious}
                isDisabled={isFirstStep}
                leftIcon={<span>←</span>}
                size="lg"
              >
                이전
              </Button>

              {isLastStep ? (
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={handleComplete}
                  isLoading={isLoading}
                  loadingText="식단 생성 중..."
                  isDisabled={!isStepValid()}
                  rightIcon={isLoading ? <Spinner size="sm" /> : <span>🎉</span>}
                  px={8}
                >
                  {isLoading ? '맞춤 식단 생성 중...' : '맞춤 식단 받기'}
                </Button>
              ) : (
                <Button
                  colorScheme="teal"
                  onClick={handleNext}
                  isDisabled={!isStepValid()}
                  rightIcon={<span>→</span>}
                  size="lg"
                >
                  다음
                </Button>
              )}
            </HStack>

            {/* 모바일 전용 버튼 레이아웃 */}
            <VStack spacing={3} w="full" display={{ base: "flex", md: "none" }}>
              {isLastStep ? (
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={handleComplete}
                  isLoading={isLoading}
                  loadingText="식단 생성 중..."
                  isDisabled={!isStepValid()}
                  rightIcon={isLoading ? <Spinner size="sm" /> : <span>🎉</span>}
                  w="full"
                  py={6}
                  fontSize="lg"
                  borderRadius="xl"
                >
                  {isLoading ? '맞춤 식단 생성 중...' : '맞춤 식단 받기'}
                </Button>
              ) : (
                <Button
                  colorScheme="teal"
                  onClick={handleNext}
                  isDisabled={!isStepValid()}
                  rightIcon={<span>→</span>}
                  size="lg"
                  w="full"
                  py={6}
                  fontSize="lg"
                  borderRadius="xl"
                >
                  다음
                </Button>
              )}
              
              {!isFirstStep && (
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={handlePrevious}
                  leftIcon={<span>←</span>}
                  size="md"
                  w="full"
                  borderRadius="xl"
                >
                  이전
                </Button>
              )}
            </VStack>
          </VStack>
        </VStack>
      </Container>
      )}
    </Layout>
  );
};

export default InputScreen;
