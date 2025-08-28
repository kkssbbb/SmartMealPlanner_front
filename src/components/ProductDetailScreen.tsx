import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Grid,
  GridItem,
  Progress,
  useToast,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Circle,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowBackIcon, ExternalLinkIcon, StarIcon, CheckCircleIcon, AddIcon } from '@chakra-ui/icons';
import { useAppContext } from '../context/AppContext';
import { mockProducts } from '../data/mockProducts';
import Layout from './Layout/Layout';

const ProductDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const toast = useToast();
  const { selectedProduct } = useAppContext();

  // URL에서 상품 ID로 상품 찾기 (fallback)
  const product = selectedProduct || mockProducts.find(p => p.id === productId);

  // 상품이 없으면 이전 페이지로 리다이렉트
  if (!product) {
    toast({
      title: '상품을 찾을 수 없습니다',
      description: '이전 페이지로 돌아갑니다.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    navigate(-1);
    return null;
  }

  // 이전 페이지로 이동
  const handleGoBack = () => {
    navigate(-1);
  };

  // 쿠팡 링크 열기
  const handleOpenCoupangLink = () => {
    window.open(product.coupangUrl, '_blank');
  };

  // 할인율 계산
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // 영양소별 권장 섭취량 대비 비율 계산 (100g 기준)
  const getNutrientPercentage = (value: number, dailyValue: number) => {
    return Math.round((value / dailyValue) * 100);
  };

  const dailyValues = {
    calories: 2000,    // kcal
    carb: 130,        // g
    protein: 50,      // g  
    fat: 65,          // g
    sodium: 2300,     // mg
    sugar: 50,        // g
  };

  return (
    <Layout>
      <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* 🍳 레시피 재료 맥락 헤더 */}
        <Card bg="gradient-to-r from-teal.50 to-green.50" borderRadius="xl">
          <CardBody p={6}>
            <HStack spacing={4} justify="space-between">
              <HStack spacing={4}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="ghost"
                  onClick={handleGoBack}
                  size="sm"
                >
                  레시피로 돌아가기
                </Button>
                <Divider orientation="vertical" h={6} />
                <Text fontSize="sm" color="teal.700" fontWeight="bold">
                  🛒 요리 재료 상세정보
                </Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* 🎨 새로운 상품 헤로 섹션 */}
        <Card borderRadius="2xl" overflow="hidden" shadow="2xl">
          <Grid templateColumns={{ base: "1fr", lg: "400px 1fr" }} gap={0}>
            {/* 왼쪽: 상품 이미지 */}
            <Box position="relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width="100%"
                height={{ base: "300px", lg: "500px" }}
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/400x500?text=🛒"
              />
              
              {/* 이미지 위 오버레이 배지들 */}
              <VStack position="absolute" top={4} left={4} spacing={2} align="start">
                <Badge 
                  colorScheme="purple" 
                  size="lg" 
                  borderRadius="full" 
                  px={3} 
                  py={1}
                  shadow="md"
                >
                  {product.category}
                </Badge>
                
                {product.isRocketDelivery && (
                  <Badge 
                    colorScheme="orange" 
                    size="lg" 
                    borderRadius="full" 
                    px={3} 
                    py={1}
                    shadow="md"
                  >
                    🚀 로켓배송
                  </Badge>
                )}
              </VStack>

              {/* 할인율 배지 */}
              {product.originalPrice && (
                <Box position="absolute" top={4} right={4}>
                  <Circle size="60px" bg="red.500" color="white" shadow="lg">
                    <VStack spacing={0}>
                      <Text fontSize="lg" fontWeight="bold">{discountPercentage}%</Text>
                      <Text fontSize="xs">할인</Text>
                    </VStack>
                  </Circle>
                </Box>
              )}
            </Box>

            {/* 오른쪽: 상품 정보 */}
            <CardBody p={8}>
              <VStack spacing={6} align="stretch" h="full">
                {/* 상품 타이틀 */}
                <VStack spacing={4} align="stretch">
                  <Heading size="xl" color="gray.800" lineHeight="1.2">
                    {product.name}
                  </Heading>
                  
                  <HStack spacing={6}>
                    <Text fontSize="lg" color="gray.600" fontWeight="medium">
                      {product.brand}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                      {product.weight}
                    </Text>
                  </HStack>

                  {/* 별점 & 리뷰 */}
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={StarIcon}
                          color={i < Math.floor(product.rating) ? "yellow.400" : "gray.300"}
                          boxSize={5}
                        />
                      ))}
                    </HStack>
                    <Text fontWeight="bold" fontSize="lg">{product.rating}</Text>
                    <Text color="gray.600">
                      ({product.reviewCount.toLocaleString()}개 리뷰)
                    </Text>
                  </HStack>
                </VStack>

                {/* 가격 섹션 강화 */}
                <Card bg="red.50" borderColor="red.200" borderWidth={2}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">판매가격</Text>
                          <Text fontSize="4xl" fontWeight="bold" color="red.500">
                            {product.price.toLocaleString()}원
                          </Text>
                        </VStack>
                        
                        {product.originalPrice && (
                          <VStack align="end" spacing={1}>
                            <Text fontSize="sm" color="gray.500">정가</Text>
                            <Text fontSize="xl" textDecoration="line-through" color="gray.400">
                              {product.originalPrice.toLocaleString()}원
                            </Text>
                          </VStack>
                        )}
                      </Flex>
                      
                      {product.originalPrice && (
                        <Text fontSize="md" color="red.600" fontWeight="bold">
                          💰 {(product.originalPrice - product.price).toLocaleString()}원 절약!
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {/* 구매 액션 강화 */}
                <VStack spacing={3}>
                  <Button
                    colorScheme="blue"
                    size="xl"
                    width="full"
                    rightIcon={<AddIcon />}
                    onClick={handleOpenCoupangLink}
                    py={6}
                    fontSize="lg"
                    borderRadius="xl"
                  >
                    🛒 쿠팡에서 바로 구매
                  </Button>
                  
                  <HStack spacing={2} justify="center">
                    <Icon as={CheckCircleIcon} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      안전한 쿠팡 결제 시스템으로 보호됩니다
                    </Text>
                  </HStack>
                </VStack>

                {/* 상품 설명 */}
                <Box bg="gray.50" p={5} borderRadius="xl">
                  <Text color="gray.700" lineHeight="1.8" fontSize="md">
                    {product.description}
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Grid>
        </Card>

        {/* 🥗 영양성분 카드 - 더 시각적으로 */}
        <Card borderRadius="2xl" shadow="lg">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={3} justify="center">
                <Text fontSize="xl">🥗</Text>
                <Heading size="lg" color="teal.700">영양성분 정보</Heading>
                <Text fontSize="xl">🥗</Text>
              </HStack>
              
              <Text textAlign="center" color="gray.600" fontSize="sm">
                100g 당 영양성분 • 일일 권장 섭취량 기준
              </Text>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
                  <CardBody textAlign="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">🔥</Text>
                      <Text fontSize="sm" color="gray.600">칼로리</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {product.nutrition.calories}
                      </Text>
                      <Text fontSize="xs" color="gray.500">kcal</Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="orange.50" borderColor="orange.200" borderWidth={1}>
                  <CardBody textAlign="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">🍞</Text>
                      <Text fontSize="sm" color="gray.600">탄수화물</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        {product.nutrition.carb}
                      </Text>
                      <Text fontSize="xs" color="gray.500">g</Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="red.50" borderColor="red.200" borderWidth={1}>
                  <CardBody textAlign="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">🥩</Text>
                      <Text fontSize="sm" color="gray.600">단백질</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="red.600">
                        {product.nutrition.protein}
                      </Text>
                      <Text fontSize="xs" color="gray.500">g</Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="yellow.50" borderColor="yellow.200" borderWidth={1}>
                  <CardBody textAlign="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">🥑</Text>
                      <Text fontSize="sm" color="gray.600">지방</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                        {product.nutrition.fat}
                      </Text>
                      <Text fontSize="xs" color="gray.500">g</Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* 상세 영양 성분표 */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md" color="teal.700">📊 상세 영양 성분표</Heading>
              <Text fontSize="sm" color="gray.600">
                * 100g 당 영양성분 / 일일 권장 섭취량 대비 비율
              </Text>
              
              <TableContainer>
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      <Th>영양소</Th>
                      <Th isNumeric>함량</Th>
                      <Th>일일 권장량 대비</Th>
                      <Th>비율</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td fontWeight="bold">칼로리</Td>
                      <Td isNumeric>{product.nutrition.calories} kcal</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.calories, dailyValues.calories)} 
                          colorScheme="blue" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.calories, dailyValues.calories)}%</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">탄수화물</Td>
                      <Td isNumeric>{product.nutrition.carb} g</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.carb, dailyValues.carb)} 
                          colorScheme="orange" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.carb, dailyValues.carb)}%</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">단백질</Td>
                      <Td isNumeric>{product.nutrition.protein} g</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.protein, dailyValues.protein)} 
                          colorScheme="red" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.protein, dailyValues.protein)}%</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">지방</Td>
                      <Td isNumeric>{product.nutrition.fat} g</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.fat, dailyValues.fat)} 
                          colorScheme="yellow" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.fat, dailyValues.fat)}%</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">나트륨</Td>
                      <Td isNumeric>{product.nutrition.sodium} mg</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.sodium, dailyValues.sodium)} 
                          colorScheme="purple" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.sodium, dailyValues.sodium)}%</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">당류</Td>
                      <Td isNumeric>{product.nutrition.sugar} g</Td>
                      <Td>
                        <Progress 
                          value={getNutrientPercentage(product.nutrition.sugar, dailyValues.sugar)} 
                          colorScheme="pink" 
                          size="sm" 
                          width="80px"
                        />
                      </Td>
                      <Td>{getNutrientPercentage(product.nutrition.sugar, dailyValues.sugar)}%</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </CardBody>
        </Card>

        {/* 🚀 고정 하단 액션 바 */}
        <Card 
          position="sticky" 
          bottom={8} 
          zIndex={1000} 
          borderRadius="2xl" 
          shadow="2xl"
          bg="white"
          borderWidth={2}
          borderColor="gray.200"
        >
          <CardBody p={4}>
            <HStack spacing={4} justify="space-between" align="center">
              <HStack spacing={4}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleGoBack}
                  leftIcon={<ArrowBackIcon />}
                  borderRadius="xl"
                >
                  레시피로
                </Button>
                <Divider orientation="vertical" h={8} />
                <VStack spacing={0} align="start">
                  <Text fontSize="xs" color="gray.500">재료비</Text>
                  <Text fontSize="xl" fontWeight="bold" color="red.500">
                    {product.price.toLocaleString()}원
                  </Text>
                </VStack>
              </HStack>
              
              <Button
                colorScheme="blue"
                size="lg"
                rightIcon={<AddIcon />}
                onClick={handleOpenCoupangLink}
                borderRadius="xl"
                px={8}
                fontWeight="bold"
              >
                바로 구매
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* 레시피 맥락 도움말 */}
        <Card bg="gradient-to-r from-green.50 to-teal.50" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={3} textAlign="center">
              <HStack spacing={2}>
                <Text fontSize="lg">🍳</Text>
                <Text fontWeight="bold" color="teal.700">레시피 재료 구매 팁</Text>
                <Text fontSize="lg">🍳</Text>
              </HStack>
              <Text fontSize="sm" color="green.800" lineHeight="1.6">
                💡 <strong>이 재료로 맛있는 요리를 완성하세요!</strong> 
                영양 성분은 제품 포장지 기준이며, 정확한 정보는 쿠팡에서 확인 가능합니다. 
                로켓배송으로 빠르게 받아보세요! 🚀
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
    </Layout>
  );
};

export default ProductDetailScreen;
