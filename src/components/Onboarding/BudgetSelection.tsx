import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  Box,
  Badge,
  Alert,
  AlertIcon,
  Button,
  Divider,
} from '@chakra-ui/react';

interface BudgetSelectionProps {
  selectedBudget: number;
  onBudgetSelect: (budget: number) => void;
}

const BudgetSelection: React.FC<BudgetSelectionProps> = ({
  selectedBudget,
  onBudgetSelect,
}) => {
  const [customBudget, setCustomBudget] = useState(selectedBudget);
  const [useCustom, setUseCustom] = useState(false);

  const selectedBg = useColorModeValue('teal.50', 'teal.900');
  const selectedBorder = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // 추천 예산 옵션들
  const budgetOptions = [
    {
      value: 130000,
      label: '13만원',
      subtitle: '절약형',
      description: '한끼 6천원대로 알뜰하게 구성한 일주일 식단',
      features: ['기본 단백질(달걀,닭가슴살)', '제철 채소류', '쌀/면류 중심'],
      color: 'blue',
      recommended: false,
    },
    {
      value: 170000,
      label: '17만원',
      subtitle: '표준형',
      description: '한끼 8천원대로 균형잡힌 일주일 식단',
      features: ['다양한 육류/생선', '신선한 채소/과일', '유제품 포함'],
      color: 'green',
      recommended: true,
    },
    {
      value: 210000,
      label: '21만원',
      subtitle: '풍성형',
      description: '한끼 1만원대로 풍성한 일주일 식단',
      features: ['프리미엄 육류', '수입 과일', '견과류/건강식품'],
      color: 'orange',
      recommended: false,
    },
    {
      value: 250000,
      label: '25만원',
      subtitle: '프리미엄',
      description: '한끼 12천원대로 최고급 일주일 식단',
      features: ['최고급 식재료', '오가닉 제품', '고급 건강보조식품'],
      color: 'purple',
      recommended: false,
    },
  ];

  const handlePresetSelect = (budget: number) => {
    setUseCustom(false);
    setCustomBudget(budget);
    onBudgetSelect(budget);
  };

  const handleCustomBudgetChange = (value: number) => {
    setCustomBudget(value);
    if (useCustom) {
      onBudgetSelect(value);
    }
  };

  const handleCustomToggle = () => {
    const newUseCustom = !useCustom;
    setUseCustom(newUseCustom);
    if (newUseCustom) {
      onBudgetSelect(customBudget);
    }
  };

  const getBudgetAdvice = (budget: number) => {
    if (budget < 120000) {
      return { type: 'warning', message: '예산이 부족해요. 한끼 5천원대로 영양 공급이 제한적일 수 있어요.' };
    } else if (budget < 150000) {
      return { type: 'info', message: '알뜰한 예산이네요! 한끼 6-7천원대로 기본적인 영양소 위주로 추천해드릴게요.' };
    } else if (budget <= 200000) {
      return { type: 'success', message: '적당한 예산이에요! 한끼 8-9천원대로 균형잡힌 일주일 식단을 구성할 수 있어요.' };
    } else if (budget <= 280000) {
      return { type: 'info', message: '여유로운 예산이네요! 한끼 1만원 이상으로 프리미엄 식재료도 포함할 수 있어요.' };
    } else {
      return { type: 'warning', message: '예산이 높아요. 더 효율적인 식단 구성을 권장드려요.' };
    }
  };

  const advice = getBudgetAdvice(useCustom ? customBudget : selectedBudget);
  const currentBudget = useCustom ? customBudget : selectedBudget;

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">💰</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          이번주 장보기 예산을 설정해주세요
        </Text>
        <Text color="gray.600">
          일주일 예산에 맞는 최적의 식단을 추천해드려요
        </Text>
      </VStack>

      {/* 추천 예산 옵션들 */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {budgetOptions.map((option) => (
          <Card
            key={option.value}
            cursor="pointer"
            onClick={() => handlePresetSelect(option.value)}
            bg={selectedBudget === option.value && !useCustom ? selectedBg : 'white'}
            borderWidth={selectedBudget === option.value && !useCustom ? '2px' : '1px'}
            borderColor={selectedBudget === option.value && !useCustom ? selectedBorder : 'gray.200'}
            _hover={{
              bg: selectedBudget === option.value && !useCustom ? selectedBg : hoverBg,
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
            position="relative"
          >
            {option.recommended && (
              <Badge
                position="absolute"
                top={-2}
                right={-2}
                colorScheme="teal"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                ✨ 추천
              </Badge>
            )}
            <CardBody p={5}>
              <VStack spacing={3} align="stretch">
                {/* 헤더 */}
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {option.label}
                    </Text>
                    <Badge colorScheme={option.color} size="sm">
                      {option.subtitle}
                    </Badge>
                  </VStack>
                </HStack>

                {/* 설명 */}
                <Text fontSize="sm" color="gray.600" lineHeight="1.4">
                  {option.description}
                </Text>

                {/* 특징 */}
                <VStack spacing={1} align="stretch">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    포함 항목:
                  </Text>
                  {option.features.map((feature, index) => (
                    <HStack key={index} spacing={2}>
                      <Text fontSize="xs" color={`${option.color}.500`}>
                        •
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Divider />

      {/* 직접 입력 옵션 */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">직접 예산 설정하기</Text>
                <Text fontSize="sm" color="gray.600">
                  원하는 예산을 직접 입력할 수 있어요
                </Text>
              </VStack>
              <Button
                size="sm"
                variant={useCustom ? "solid" : "outline"}
                colorScheme="teal"
                onClick={handleCustomToggle}
              >
                {useCustom ? "사용 중" : "사용하기"}
              </Button>
            </HStack>

            {useCustom && (
              <HStack spacing={4}>
                <NumberInput
                  value={customBudget}
                  onChange={(_, value) => handleCustomBudgetChange(isNaN(value) ? 0 : value)}
                  min={100000}
                  max={350000}
                  step={10000}
                  size="lg"
                  flex={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="lg" color="gray.600" minW="30px">
                  원
                </Text>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* 예산 조언 */}
      <Alert
        status={advice.type as any}
        borderRadius="md"
      >
        <AlertIcon />
        <Box>
          <Text fontSize="sm">
            <strong>💡 예산 분석:</strong> {advice.message}
          </Text>
        </Box>
      </Alert>

      {/* 예산별 권장사항 */}
      <Box bg="blue.50" p={4} borderRadius="md" border="1px" borderColor="blue.200">
        <Text fontSize="sm" color="blue.800" textAlign="center">
          💰 <strong>현재 설정: {currentBudget.toLocaleString()}원</strong>
          <br />
          1인 기준 한 달 식비로 {currentBudget >= 300000 ? '넉넉한' : currentBudget >= 200000 ? '적당한' : '절약형'} 예산이에요.
        </Text>
      </Box>
    </VStack>
  );
};

export default BudgetSelection;
