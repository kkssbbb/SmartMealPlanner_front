import React from 'react';
import {
  VStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { getActivityDescription } from '../../utils/calorieCalculator';

interface ActivityLevelProps {
  selectedActivity?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  onActivitySelect: (activity: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active') => void;
}

const ActivityLevel: React.FC<ActivityLevelProps> = ({
  selectedActivity,
  onActivitySelect,
}) => {
  const selectedBg = useColorModeValue('teal.50', 'teal.900');
  const selectedBorder = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const activityOptions = [
    {
      value: 'sedentary' as const,
      emoji: '🪑',
      title: '운동 안함',
      subtitle: '사무직, 재택근무',
      multiplier: '1.2x',
      description: '주로 앉아서 생활하고 운동을 거의 하지 않음',
      examples: ['사무직', '재택근무', '독서', 'TV 시청'],
      color: 'gray',
    },
    {
      value: 'lightly_active' as const,
      emoji: '🚶‍♂️',
      title: '가벼운 활동',
      subtitle: '주 1-3회 운동',
      multiplier: '1.375x',
      description: '가벼운 운동이나 산책을 주 1-3회 정도',
      examples: ['산책', '요가', '가벼운 헬스', '주말 등산'],
      color: 'blue',
    },
    {
      value: 'moderately_active' as const,
      emoji: '🏃‍♂️',
      title: '보통 활동',
      subtitle: '주 3-5회 운동',
      multiplier: '1.55x',
      description: '중간 강도 운동을 주 3-5회 규칙적으로',
      examples: ['헬스장', '수영', '테니스', '축구'],
      color: 'orange',
    },
    {
      value: 'very_active' as const,
      emoji: '🏋️‍♂️',
      title: '활발한 활동',
      subtitle: '주 6-7회 운동',
      multiplier: '1.725x',
      description: '고강도 운동을 주 6-7회 하거나 스포츠 선수',
      examples: ['매일 헬스', '마라톤 훈련', '스포츠 선수', '댄스'],
      color: 'red',
    },
    {
      value: 'extremely_active' as const,
      emoji: '⚡',
      title: '매우 활발',
      subtitle: '육체 노동 + 운동',
      multiplier: '1.9x',
      description: '매우 고강도 운동이나 육체적 직업을 병행',
      examples: ['건설업', '배달업', '하루 2회 운동', '프로 운동선수'],
      color: 'purple',
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">🏃‍♂️</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          평소 활동량은 어느 정도인가요?
        </Text>
        <Text color="gray.600">
          활동량에 따라 필요한 칼로리가 달라져요
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {activityOptions.map((option) => (
          <Card
            key={option.value}
            cursor="pointer"
            onClick={() => onActivitySelect(option.value)}
            bg={selectedActivity === option.value ? selectedBg : 'white'}
            borderWidth={selectedActivity === option.value ? '2px' : '1px'}
            borderColor={selectedActivity === option.value ? selectedBorder : 'gray.200'}
            _hover={{
              bg: selectedActivity === option.value ? selectedBg : hoverBg,
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
            height="full"
          >
            <CardBody p={5}>
              <VStack spacing={3} align="stretch" height="full">
                {/* 헤더 */}
                <VStack spacing={2}>
                  <Text fontSize="3xl">{option.emoji}</Text>
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    {option.title}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme={option.color} fontSize="xs">
                      {option.subtitle}
                    </Badge>
                    <Badge variant="outline" fontSize="xs">
                      {option.multiplier}
                    </Badge>
                  </HStack>
                </VStack>

                {/* 설명 */}
                <Text fontSize="sm" color="gray.600" textAlign="center" lineHeight="1.4">
                  {option.description}
                </Text>

                {/* 예시 */}
                <VStack spacing={1} align="stretch" flex={1}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    예시:
                  </Text>
                  {option.examples.map((example, index) => (
                    <Text key={index} fontSize="xs" color="gray.600">
                      • {example}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Card bg="yellow.50" borderColor="yellow.200">
        <CardBody>
          <Text fontSize="sm" color="yellow.800" textAlign="center">
            🤔 <strong>잘 모르겠다면?</strong> 대부분의 사람들은 "가벼운 활동" 또는 "보통 활동"에 해당해요.
            나중에 언제든 변경할 수 있으니 편하게 선택해주세요!
          </Text>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ActivityLevel;
