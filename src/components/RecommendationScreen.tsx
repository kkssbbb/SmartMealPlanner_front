import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Badge,
  useToast,
  Collapse,
  Icon,
} from '@chakra-ui/react';
import { ArrowBackIcon, ExternalLinkIcon, TimeIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAppContext } from '../context/AppContext';
import { CoupangProduct, Recipe } from '../types';
import { getRecipesByGoal, getRecipeIngredients, recipeLoader } from '../data/recipeData';
import { calculateRecipeFrequency } from '../utils/personalizedRecommendation';
import { debugRecipeMapping } from '../utils/recipeDebugger';

import Layout from './Layout/Layout';

const RecommendationScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    userInput,
    recommendationResult,
    setSelectedProduct,
    userProfile // 사용자 목표 정보 가져오기
  } = useAppContext();

  // 🍳 사용자 목표에 맞는 레시피 가져오기 (비동기) - hooks를 조건부 리턴 전에 선언
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [recipeStats, setRecipeStats] = useState<any>(null);
  
  useEffect(() => {
    // 추천 결과가 없으면 메인 페이지로 리다이렉트
    if (!recommendationResult) {
      toast({
        title: "추천 결과를 찾을 수 없습니다",
        description: "메인 페이지로 돌아가서 다시 시도해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
      return;
    }
    
    const loadRecipes = async () => {
      setIsLoadingRecipes(true);
      try {
        // 🔍 디버깅 실행
        console.log('🔍 === 레시피 매핑 디버깅 시작 ===');
        debugRecipeMapping();
        
        // 캐시 진단
        console.log('🔍 === 캐시 진단 시작 ===');
        await recipeLoader.diagnoseCacheStatus();
        
        // 사용자 목표 확인 및 설정
        const userGoal = userProfile.goal || 'maintenance';
        console.log('🎯 사용자 목표:', userGoal);
        
        // 목표가 없으면 기본값으로 설정
        if (!userProfile.goal) {
          console.log('⚠️ 사용자 목표가 설정되지 않음, 기본값(maintenance)으로 설정');
        }
        
        // 레시피 로드
        const recipes = await getRecipesByGoal(userGoal);
        console.log('📋 로드된 레시피 수:', recipes.length);
        console.log('📋 레시피 ID들:', recipes.map(r => r.id));
        
        if (recipes.length === 0) {
          console.error('⚠️ 레시피가 하나도 로드되지 않았습니다!');
          console.log('💡 CSV 파일이 제대로 로드되는지 네트워크 탭에서 확인하세요');
          console.log('💡 브라우저 콘솔에서 에러 메시지를 확인하세요');
          
          // 통계 정보로 CSV 로드 여부 확인
          const stats = await recipeLoader.getStatistics();
          console.log('📊 CSV 통계:', stats);
          if (stats.totalRecipes === 0) {
            console.error('❌ CSV 파일이 로드되지 않았습니다!');
          }
        }
        
        setRecommendedRecipes(recipes);
        
        // 통계 정보 로드
        const stats = await recipeLoader.getStatistics();
        setRecipeStats(stats);
      } catch (error) {
        console.error('❌ 레시피 로드 실패:', error);
        
        // 에러 상세 정보
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message);
          console.error('에러 스택:', error.stack);
        }
        
        // 빈 배열로 설정하여 UI 크래시 방지
        setRecommendedRecipes([]);
      } finally {
        setIsLoadingRecipes(false);
      }
    };
    
    loadRecipes();
  }, [userProfile.goal]);

  // recommendationResult가 없으면 로딩 상태 표시
  if (!recommendationResult) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <Text textAlign="center">로딩 중...</Text>
        </Container>
      </Layout>
    );
  }

  const { 
    totalBudgetUsed, 
    budgetRemaining, 
    nutritionBalance, 
    message, 
    nutritionTargets,
    userInsights 
  } = recommendationResult;
  
  // 시간대별 레시피 분류
  const mealTypeRecipes = {
    breakfast: recommendedRecipes.filter(r => r.mealType === 'breakfast'),
    lunch: recommendedRecipes.filter(r => r.mealType === 'lunch'),
    dinner: recommendedRecipes.filter(r => r.mealType === 'dinner'),
  };

  // 상품 클릭 핸들러
  const handleProductClick = (product: CoupangProduct) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  // 다시 입력하기 핸들러
  const handleBackToInput = () => {
    navigate('/');
  };

  const budgetUsagePercentage = (totalBudgetUsed / userInput.budget) * 100;

  // 🎨 컴팩트 레시피 카드 컴포넌트
  const CompactRecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
    const ingredients = getRecipeIngredients(recipe.id);
    const totalPrice = ingredients.reduce((sum: number, ing: any) => sum + ing.product.price, 0);
    const toastForBulkPurchase = useToast();

    // 🛒 전체 구매 핸들러
    const handleBulkPurchase = (ingredients: any[]) => {
      
      // 사용자에게 확인 메시지
      const confirmMessage = `${ingredients.length}개의 재료를 모두 구매하시겠습니까?\n총 예상 비용: ${totalPrice.toLocaleString()}원\n\n각 재료의 쿠팡 페이지가 새 탭으로 열립니다.`;
      
      if (window.confirm(confirmMessage)) {
        // 500ms 간격으로 순차적으로 새 탭 열기 (브라우저 팝업 차단 방지)
        ingredients.forEach((ingredient, index) => {
          setTimeout(() => {
            window.open(ingredient.product.coupangUrl, '_blank');
          }, index * 500);
        });

        // 성공 토스트 메시지
        toastForBulkPurchase({
          title: '전체 구매 페이지 열기 완료',
          description: `${ingredients.length}개 재료의 쿠팡 페이지가 새 탭으로 열렸습니다.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // 분석을 위한 이벤트 로깅 (선택사항)
        console.log('Bulk purchase initiated:', {
          recipeId: recipe.id,
          recipeName: recipe.name,
          totalPrice,
          ingredientCount: ingredients.length,
          ingredients: ingredients.map(ing => ({
            name: ing.product.name,
            price: ing.product.price,
            quantity: ing.quantity
          }))
        });
      }
    };
    
    // 🍽️ 레시피 제조 빈도 분석
    const recipeFrequency = calculateRecipeFrequency(recipe.id);
    
    // 🧮 영양소 계산 (재료별 영양소 × 사용량)
    const totalNutrition = ingredients.reduce((total: any, ing: any) => {
      const product = ing.product;
      const ratio = ing.quantity / 100; // 100g 기준으로 계산
      
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

    return (
      <Card 
        borderRadius={{ base: "lg", md: "xl" }}
        overflow="hidden" 
        shadow={{ base: "sm", md: "md" }}
        _hover={{ transform: { base: "none", md: "translateY(-2px)" }, shadow: { base: "md", md: "lg" } }}
        transition="all 0.2s ease"
        bg="white"
        border="1px"
        borderColor="gray.200"
      >
        <CardBody p={{ base: 3, md: 4 }}>
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                        {/* 반응형 레이아웃 - 모든 화면 크기 지원 */}
            <HStack spacing={{ base: 3, lg: 4 }} align="start">
            <Box position="relative" flexShrink={0}>
              <Image 
                src={recipe.image} 
                alt={recipe.name} 
                  w={{ base: "80px", sm: "100px", lg: "120px" }}
                  h={{ base: "80px", sm: "100px", lg: "120px" }}
                objectFit="cover" 
                  borderRadius={{ base: "md", lg: "lg" }}
                fallbackSrc="https://via.placeholder.com/120x120?text=🍽️"
              />
              <Badge 
                position="absolute" 
                  top={{ base: 1, lg: 2 }}
                  right={{ base: 1, lg: 2 }}
                  colorScheme={recipe.difficulty === 'easy' ? 'green' : recipe.difficulty === 'medium' ? 'yellow' : 'red'}
                  fontSize="xs"
                borderRadius="md"
                  size={{ base: "sm", lg: "md" }}
              >
                {recipe.difficulty === 'easy' ? '쉬움' : recipe.difficulty === 'medium' ? '보통' : '어려움'}
              </Badge>
            </Box>

              <VStack align="start" spacing={{ base: 2, lg: 3 }} flex={1} minW={0}>
                <Heading size={{ base: "sm", lg: "md" }} color="gray.800" noOfLines={2} lineHeight="shorter">
                  {recipe.name}
                </Heading>
                <Text color="gray.600" fontSize={{ base: "xs", lg: "sm" }} noOfLines={2} lineHeight="1.3">
                  {recipe.description}
                </Text>
                
                <HStack spacing={{ base: 3, lg: 4 }} wrap="wrap" w="full">
                  <HStack spacing={1}>
                    <TimeIcon boxSize={3} color="orange.500" />
                    <Text fontSize={{ base: "xs", lg: "sm" }} fontWeight="medium">{recipe.cookingTime}분</Text>
                  </HStack>
                  <Text fontSize={{ base: "xs", lg: "sm" }} color="gray.500">재료 {ingredients.length}개</Text>
                  <Text fontSize={{ base: "sm", lg: "md" }} fontWeight="bold" color="teal.600">
                    {totalPrice.toLocaleString()}원
                          </Text>
                        </HStack>
                      </VStack>
                      </HStack>
                      
            {/* 영양정보 - 반응형 */}
            <HStack spacing={{ base: 2, lg: 3 }} justify="space-between" align="center" w="full" bg="gray.50" p={{ base: 2, lg: 3 }} borderRadius="md">
              <VStack spacing={0} align="center" minW="45px">
                <Text fontSize="xs" color="orange.600" fontWeight="bold">
                            {Math.round(totalNutrition.calories)}
                          </Text>
                <Text fontSize="xs" color="gray.500">kcal</Text>
                        </VStack>
              <VStack spacing={0} align="center" minW="35px">
                <Text fontSize="xs" color="blue.600" fontWeight="bold">
                            {Math.round(totalNutrition.carb)}g
                          </Text>
                <Text fontSize="xs" color="gray.500">탄수</Text>
                        </VStack>
              <VStack spacing={0} align="center" minW="35px">
                <Text fontSize="xs" color="red.600" fontWeight="bold">
                            {Math.round(totalNutrition.protein)}g
                          </Text>
                <Text fontSize="xs" color="gray.500">단백질</Text>
                        </VStack>
              <VStack spacing={0} align="center" minW="35px">
                <Text fontSize="xs" color="green.600" fontWeight="bold">
                            {Math.round(totalNutrition.fat)}g
                          </Text>
                <Text fontSize="xs" color="gray.500">지방</Text>
                        </VStack>
                      </HStack>

            {/* 재료 정보 - 반응형 */}
            <VStack spacing={2} align="stretch" w="full">
              <HStack spacing={2} justify="space-between" align="center" w="full">
                <HStack 
                  spacing={2} 
                  cursor="pointer"
                  onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                  _hover={{ bg: "gray.50" }}
                  p={1}
                  borderRadius="md"
                  transition="all 0.2s ease"
                  flex={1}
                >
                  <Text fontSize="xs" fontWeight="medium" color="gray.700">
                    🛒 필요한 재료 ({ingredients.length}개)
                                </Text>
                  <Icon 
                    as={isIngredientsOpen ? ChevronUpIcon : ChevronDownIcon} 
                    boxSize={3} 
                    color="gray.500" 
                  />
                              </HStack>
                
                                {/* 전체 구매 버튼 - 반응형 */}
              <Button 
                  size="xs"
                  colorScheme="blue"
                  variant="solid"
                  borderRadius="full"
                  px={{ base: 2, sm: 3 }}
                  fontSize="xs"
                  fontWeight="bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBulkPurchase(ingredients);
                  }}
                  _hover={{ 
                    transform: "scale(1.05)",
                    boxShadow: "md"
                  }}
                transition="all 0.2s ease"
              >
                  <Text display={{ base: "none", sm: "block" }}>🛒 전체구매</Text>
                  <Text display={{ base: "block", sm: "none" }}>🛒</Text>
              </Button>
              </HStack>
              
              <Collapse in={isIngredientsOpen} animateOpacity>
                <VStack spacing={2} align="stretch" mt={2}>
                  {ingredients.map((ingredient: any, index: number) => (
                    <Box 
                      key={index} 
                      bg="white" 
                      p={{ base: 2, sm: 3 }}
                    borderRadius="lg"
                      border="1px" 
                      borderColor="gray.200"
                      cursor="pointer"
                      _hover={{ 
                        bg: "blue.50", 
                        borderColor: "blue.300",
                        transform: "translateY(-1px)",
                        shadow: "md"
                      }}
                    transition="all 0.2s ease"
                      onClick={() => {
                        window.open(ingredient.product.coupangUrl, '_blank');
                      }}
                    >
                        <VStack spacing={2} align="stretch">
                        <HStack spacing={2} justify="space-between" align="center">
                          <HStack spacing={2} flex={1} minW={0}>
                              <Image 
                                src={ingredient.product.imageUrl} 
                                alt={ingredient.product.name} 
                              boxSize={{ base: "25px", sm: "30px" }}
                                objectFit="cover" 
                                borderRadius="md" 
                              fallbackSrc="https://via.placeholder.com/30x30?text=🛒" 
                              />
                            <VStack align="start" spacing={0} flex={1} minW={0}>
                                <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                                  {ingredient.product.name}
                                </Text>
                                  <Text fontSize="xs" color="gray.600">
                                {ingredient.quantity}{ingredient.unit} 필요
                                  </Text>
                            </VStack>
                          </HStack>
                          <VStack spacing={0} align="end" minW="60px">
                                  <Text fontSize="xs" fontWeight="bold" color="red.500">
                                    {ingredient.product.price.toLocaleString()}원
                                  </Text>
                            <HStack spacing={1}>
                              <Icon as={ExternalLinkIcon} boxSize={2} color="blue.500" />
                              <Text fontSize="xs" color="blue.500">구매</Text>
                                </HStack>
                          </VStack>
                                  </HStack>
                        
                        <HStack spacing={2} justify="space-between" align="center" bg="gray.50" p={1.5} borderRadius="md">
                          <Text fontSize="xs" color="gray.600" fontWeight="medium" minW="40px">
                            {ingredient.quantity}{ingredient.unit} 기준
                          </Text>
                          <HStack spacing={2} flex={1} justify="space-around">
                            <VStack spacing={0} align="center" minW="25px">
                                      <Text fontSize="xs" color="orange.600" fontWeight="bold">
                                        {Math.round(ingredient.product.nutrition.calories * ingredient.quantity / 100)}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">kcal</Text>
                                    </VStack>
                            <VStack spacing={0} align="center" minW="20px">
                                      <Text fontSize="xs" color="blue.600" fontWeight="bold">
                                        {Math.round(ingredient.product.nutrition.carb * ingredient.quantity / 100)}g
                                      </Text>
                              <Text fontSize="xs" color="gray.500">탄수</Text>
                                    </VStack>
                            <VStack spacing={0} align="center" minW="20px">
                                      <Text fontSize="xs" color="red.600" fontWeight="bold">
                                        {Math.round(ingredient.product.nutrition.protein * ingredient.quantity / 100)}g
                                      </Text>
                              <Text fontSize="xs" color="gray.500">단백질</Text>
                                    </VStack>
                            <VStack spacing={0} align="center" minW="20px">
                                      <Text fontSize="xs" color="green.600" fontWeight="bold">
                                        {Math.round(ingredient.product.nutrition.fat * ingredient.quantity / 100)}g
                                      </Text>
                              <Text fontSize="xs" color="gray.500">지방</Text>
                                    </VStack>
                                  </HStack>
                                          </HStack>
                                        </VStack>
                                  </Box>
                              ))}
                        </VStack>
              </Collapse>
                            </VStack>
                            </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Layout>
      <Container maxW={{ base: "100%", sm: "container.sm", md: "container.md", lg: "6xl" }} px={{ base: 3, md: 6 }} py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          {/* 헤더 - 모바일 최적화 */}
          <Card bg="white" borderRadius={{ base: "xl", md: "2xl" }} shadow={{ base: "md", md: "lg" }} border="1px" borderColor="gray.200">
            <CardBody p={{ base: 4, md: 6 }}>
              <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                <HStack justify="space-between" align="center" w="full">
                  <Button 
                    leftIcon={<ArrowBackIcon />} 
                    variant="ghost" 
                    colorScheme="gray"
                    size={{ base: "sm", md: "md" }}
                    onClick={handleBackToInput}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    <Text display={{ base: "none", sm: "block" }}>다시 입력하기</Text>
                    <Text display={{ base: "block", sm: "none" }}>다시입력</Text>
                  </Button>
                </HStack>
                <VStack align="start" spacing={{ base: 1, md: 2 }} w="full">
                  <Heading size={{ base: "md", md: "lg" }} color="gray.800" lineHeight="shorter">
                      🍳 {userProfile.goal === 'weight_loss' ? '다이어트' : 
                          userProfile.goal === 'muscle_gain' ? '근성장' : '건강 유지'} 맞춤 레시피
                    </Heading>
                  </VStack>
                    </VStack>
              </CardBody>
            </Card>





          {/* 간단한 구분선 */}
          {isLoadingRecipes && (
            <Box textAlign="center" py={2}>
              <Text fontSize="sm" color="gray.600">레시피 로딩 중...</Text>
                    </Box>
                  )}



          {/* 추천 레시피 리스트 */}
          <Card bg="white" borderRadius="xl" shadow="sm">
            <CardBody p={{ base: 4, md: 6 }}>
              <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                <VStack spacing={3} align="stretch">
                  {recommendedRecipes.map((recipe) => (
                    <CompactRecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </VStack>
                </VStack>
            </CardBody>
          </Card>

          {/* 하단 액션 버튼 - 모바일 최적화 */}
          <HStack spacing={{ base: 2, md: 4 }} justify="center" px={{ base: 4, md: 0 }}>
            <Button 
              colorScheme="gray" 
              variant="outline" 
              size={{ base: "md", md: "lg" }}
              onClick={handleBackToInput} 
              leftIcon={<ArrowBackIcon />}
              w={{ base: "full", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
            >
              다시 입력하기
            </Button>
          </HStack>


        </VStack>
      </Container>
    </Layout>
  );
};

export default RecommendationScreen;