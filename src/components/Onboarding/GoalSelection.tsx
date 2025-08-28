import React from 'react';
import {
  VStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  Box,
  HStack,
  Badge,
} from '@chakra-ui/react';

interface GoalSelectionProps {
  selectedGoal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
  onGoalSelect: (goal: 'weight_loss' | 'maintenance' | 'muscle_gain') => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({
  selectedGoal,
  onGoalSelect,
}) => {
  const selectedBg = useColorModeValue('teal.50', 'teal.900');
  const selectedBorder = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const goalOptions = [
    {
      value: 'weight_loss' as const,
      emoji: '🔥',
      title: '체중 감량',
      subtitle: '건강한 다이어트',
      description: '과학적인 칼로리 계산으로 건강하게 체중을 줄여보세요',
      features: ['칼로리 20% 감소', '단백질 비율 증가', '근손실 방지'],
      color: 'red',
      timeframe: '주당 0.5kg 감량',
    },
    {
      value: 'maintenance' as const,
      emoji: '⚖️',
      title: '체중 유지',
      subtitle: '균형잡힌 식단',
      description: '현재 체중을 유지하면서 건강한 영양 균형을 맞춰보세요',
      features: ['현재 칼로리 유지', '균형잡힌 영양소', '건강한 라이프스타일'],
      color: 'green',
      timeframe: '체중 현상 유지',
    },
    {
      value: 'muscle_gain' as const,
      emoji: '💪',
      title: '근성장',
      subtitle: '탄탄한 몸매',
      description: '충분한 영양으로 근육을 키우고 탄탄한 몸매를 만들어보세요',
      features: ['칼로리 15% 증가', '단백질 비율 최적화', '근육 성장 촉진'],
      color: 'blue',
      timeframe: '월 0.5-1kg 증량',
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">🎯</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          어떤 목표가 있으신가요?
        </Text>
        <Text color="gray.600">
          목표에 따라 최적의 칼로리와 영양소 비율을 계산해드려요
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {goalOptions.map((option) => (
          <Card
            key={option.value}
            cursor="pointer"
            onClick={() => onGoalSelect(option.value)}
            bg={selectedGoal === option.value ? selectedBg : 'white'}
            borderWidth={selectedGoal === option.value ? '2px' : '1px'}
            borderColor={selectedGoal === option.value ? selectedBorder : 'gray.200'}
            _hover={{
              bg: selectedGoal === option.value ? selectedBg : hoverBg,
              transform: 'translateY(-4px)',
              shadow: 'xl',
            }}
            transition="all 0.3s"
            height="full"
          >
            <CardBody p={6}>
              <VStack spacing={4} align="stretch" height="full">
                {/* 헤더 */}
                <VStack spacing={2}>
                  <Text fontSize="4xl">{option.emoji}</Text>
                  <Text fontSize="xl" fontWeight="bold" textAlign="center">
                    {option.title}
                  </Text>
                  <Badge colorScheme={option.color} fontSize="sm">
                    {option.subtitle}
                  </Badge>
                </VStack>

                {/* 설명 */}
                <Text fontSize="sm" color="gray.600" textAlign="center" lineHeight="1.5">
                  {option.description}
                </Text>

                {/* 예상 결과 */}
                <Box bg="gray.50" p={3} borderRadius="md">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={1}>
                    예상 결과:
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {option.timeframe}
                  </Text>
                </Box>

                {/* 특징 */}
                <VStack spacing={1} align="stretch" flex={1}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    특징:
                  </Text>
                  {option.features.map((feature, index) => (
                    <HStack key={index} spacing={2}>
                      <Text fontSize="xs" color={`${option.color}.500`}>
                        ✓
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

      <Box bg="blue.50" p={4} borderRadius="md" border="1px" borderColor="blue.200">
        <Text fontSize="sm" color="blue.800" textAlign="center">
          💡 선택하신 목표는 언제든지 변경할 수 있어요. 
          목표에 따라 칼로리와 영양소 비율이 자동으로 최적화됩니다.
        </Text>
      </Box>
    </VStack>
  );
};

export default GoalSelection;
