import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Switch,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Box,
  Progress,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { CalorieCalculation } from '../../types';
import { getGoalDescription } from '../../utils/calorieCalculator';

interface CalorieReviewProps {
  calculation: CalorieCalculation;
  userGoal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  onCaloriesChange: (calories: number, useCustom: boolean) => void;
}

const CalorieReview: React.FC<CalorieReviewProps> = ({
  calculation,
  userGoal,
  onCaloriesChange,
}) => {
  const [useCustomCalories, setUseCustomCalories] = useState(false);
  const [customCalories, setCustomCalories] = useState(calculation.targetCalories);

  const handleCustomToggle = (enabled: boolean) => {
    setUseCustomCalories(enabled);
    onCaloriesChange(
      enabled ? customCalories : calculation.targetCalories,
      enabled
    );
  };

  const handleCustomCaloriesChange = (value: number) => {
    setCustomCalories(value);
    if (useCustomCalories) {
      onCaloriesChange(value, true);
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'red';
      case 'maintenance': return 'green';
      case 'muscle_gain': return 'blue';
      default: return 'gray';
    }
  };

  const getGoalEmoji = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return '🔥';
      case 'maintenance': return '⚖️';
      case 'muscle_gain': return '💪';
      default: return '🎯';
    }
  };

  const currentCalories = useCustomCalories ? customCalories : calculation.targetCalories;
  const caloriesDiff = currentCalories - calculation.tdee;
  const percentDiff = Math.round((caloriesDiff / calculation.tdee) * 100);

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">📊</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          맞춤 칼로리가 계산되었어요!
        </Text>
        <Text color="gray.600">
          과학적 공식을 바탕으로 계산된 개인 맞춤 칼로리입니다
        </Text>
      </VStack>

      {/* 계산 결과 요약 */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Card>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>기초대사율 (BMR)</StatLabel>
              <StatNumber color="blue.500">{Math.round(calculation.bmr)}</StatNumber>
              <StatHelpText>kcal/일</StatHelpText>
            </Stat>
            <Text fontSize="xs" color="gray.500" mt={2}>
              생존에 필요한 최소 칼로리
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>총 소모 칼로리 (TDEE)</StatLabel>
              <StatNumber color="orange.500">{calculation.tdee}</StatNumber>
              <StatHelpText>kcal/일</StatHelpText>
            </Stat>
            <Text fontSize="xs" color="gray.500" mt={2}>
              활동량 포함 일일 소모량
            </Text>
          </CardBody>
        </Card>

        <Card bg={`${getGoalColor(userGoal)}.50`} borderColor={`${getGoalColor(userGoal)}.200`}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>목표 칼로리</StatLabel>
              <StatNumber color={`${getGoalColor(userGoal)}.600`}>
                {currentCalories}
              </StatNumber>
              <StatHelpText>
                {percentDiff > 0 ? '+' : ''}{percentDiff}% 
                <Badge ml={1} colorScheme={getGoalColor(userGoal)} size="sm">
                  {getGoalEmoji(userGoal)}
                </Badge>
              </StatHelpText>
            </Stat>
            <Text fontSize="xs" color="gray.600" mt={2}>
              {getGoalDescription(userGoal)}
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* 영양소 비율 */}
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="teal.700">
              🥗 최적 영양소 비율
            </Text>
            
            <SimpleGrid columns={3} spacing={4} w="full">
              <VStack>
                <Text fontSize="sm" color="gray.600">탄수화물</Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {calculation.macros.carb}%
                </Text>
                <Progress 
                  value={calculation.macros.carb} 
                  colorScheme="orange" 
                  size="sm" 
                  w="full"
                />
                <Text fontSize="xs" color="gray.500">
                  {Math.round(currentCalories * calculation.macros.carb / 100 / 4)}g
                </Text>
              </VStack>

              <VStack>
                <Text fontSize="sm" color="gray.600">단백질</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {calculation.macros.protein}%
                </Text>
                <Progress 
                  value={calculation.macros.protein} 
                  colorScheme="red" 
                  size="sm" 
                  w="full"
                />
                <Text fontSize="xs" color="gray.500">
                  {Math.round(currentCalories * calculation.macros.protein / 100 / 4)}g
                </Text>
              </VStack>

              <VStack>
                <Text fontSize="sm" color="gray.600">지방</Text>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                  {calculation.macros.fat}%
                </Text>
                <Progress 
                  value={calculation.macros.fat} 
                  colorScheme="yellow" 
                  size="sm" 
                  w="full"
                />
                <Text fontSize="xs" color="gray.500">
                  {Math.round(currentCalories * calculation.macros.fat / 100 / 9)}g
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>

      {/* 칼로리 커스터마이징 */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">직접 칼로리 설정하기</Text>
                <Text fontSize="sm" color="gray.600">
                  권장 칼로리가 맞지 않으면 직접 조정할 수 있어요
                </Text>
              </VStack>
              <Switch
                size="lg"
                colorScheme="teal"
                isChecked={useCustomCalories}
                onChange={(e) => handleCustomToggle(e.target.checked)}
              />
            </HStack>

            {useCustomCalories && (
              <FormControl>
                <FormLabel>목표 칼로리 (kcal)</FormLabel>
                <NumberInput
                  value={customCalories}
                  onChange={(_, value) => handleCustomCaloriesChange(isNaN(value) ? 0 : value)}
                  min={800}
                  max={5000}
                  step={50}
                  size="lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                {Math.abs(customCalories - calculation.targetCalories) > 300 && (
                  <Alert status="warning" mt={2} borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontSize="sm">
                        권장 칼로리와 {Math.abs(customCalories - calculation.targetCalories)}kcal 차이가 나요.
                        너무 극단적인 칼로리는 건강에 좋지 않을 수 있어요.
                      </Text>
                    </Box>
                  </Alert>
                )}
              </FormControl>
            )}
          </VStack>
        </CardBody>
      </Card>

      <Divider />

      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontSize="sm">
            <strong>💡 알아두세요!</strong> 계산된 칼로리는 일반적인 공식을 바탕으로 한 추정치예요. 
            개인차가 있을 수 있으니 2-3주 사용해보시고 필요에 따라 조정해주세요.
          </Text>
        </Box>
      </Alert>
    </VStack>
  );
};

export default CalorieReview;
