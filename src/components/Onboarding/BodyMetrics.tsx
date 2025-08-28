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
  FormControl,
  FormLabel,
  Card,
  CardBody,
  SimpleGrid,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { calculateBMI } from '../../utils/calorieCalculator';

interface BodyMetricsProps {
  height: number;
  weight: number;
  age: number;
  onMetricsChange: (metrics: { height: number; weight: number; age: number }) => void;
}

const BodyMetrics: React.FC<BodyMetricsProps> = ({
  height,
  weight,
  age,
  onMetricsChange,
}) => {
  const [localHeight, setLocalHeight] = useState(height);
  const [localWeight, setLocalWeight] = useState(weight);
  const [localAge, setLocalAge] = useState(age);

  const handleChange = (field: 'height' | 'weight' | 'age', value: number) => {
    const newMetrics = {
      height: field === 'height' ? value : localHeight,
      weight: field === 'weight' ? value : localWeight,
      age: field === 'age' ? value : localAge,
    };

    if (field === 'height') setLocalHeight(value);
    if (field === 'weight') setLocalWeight(value);
    if (field === 'age') setLocalAge(value);

    onMetricsChange(newMetrics);
  };

  // BMI 계산 및 표시
  const bmiData = localHeight > 0 && localWeight > 0 
    ? calculateBMI(localWeight, localHeight) 
    : null;

  const getBMIColor = (category: string): 'info' | 'success' | 'warning' | 'error' => {
    switch (category) {
      case 'underweight': return 'info';
      case 'normal': return 'success';
      case 'overweight': return 'warning';
      case 'obese': return 'error';
      default: return 'info';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">📏</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          몸에 대해 알려주세요
        </Text>
        <Text color="gray.600">
          정확한 칼로리 계산을 위해 필요한 정보예요
        </Text>
      </VStack>

      <Card>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {/* 키 입력 */}
            <FormControl>
              <FormLabel fontWeight="bold" color="teal.700">
                🧍‍♂️ 키
              </FormLabel>
              <HStack spacing={2}>
                <NumberInput
                  value={localHeight}
                  onChange={(_, value) => handleChange('height', isNaN(value) ? 0 : value)}
                  min={100}
                  max={250}
                  step={1}
                  size="lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="lg" color="gray.600" minW="30px">
                  cm
                </Text>
              </HStack>
            </FormControl>

            {/* 몸무게 입력 */}
            <FormControl>
              <FormLabel fontWeight="bold" color="teal.700">
                ⚖️ 몸무게
              </FormLabel>
              <HStack spacing={2}>
                <NumberInput
                  value={localWeight}
                  onChange={(_, value) => handleChange('weight', isNaN(value) ? 0 : value)}
                  min={30}
                  max={200}
                  step={0.1}
                  precision={1}
                  size="lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="lg" color="gray.600" minW="30px">
                  kg
                </Text>
              </HStack>
            </FormControl>

            {/* 나이 입력 */}
            <FormControl>
              <FormLabel fontWeight="bold" color="teal.700">
                🎂 나이
              </FormLabel>
              <HStack spacing={2}>
                <NumberInput
                  value={localAge}
                  onChange={(_, value) => handleChange('age', isNaN(value) ? 0 : value)}
                  min={15}
                  max={100}
                  step={1}
                  size="lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="lg" color="gray.600" minW="30px">
                  세
                </Text>
              </HStack>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* BMI 표시 */}
      {bmiData && (
        <Alert
          status={getBMIColor(bmiData.category)}
          borderRadius="md"
        >
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">
              BMI: {bmiData.bmi} ({bmiData.description})
            </Text>
            <Text fontSize="sm">
              {bmiData.category === 'normal' 
                ? '건강한 체중 범위에 있어요! 👍'
                : bmiData.category === 'underweight'
                ? '체중이 조금 부족해요. 균형잡힌 식단으로 건강한 체중을 만들어보세요.'
                : bmiData.category === 'overweight'
                ? '약간의 체중 감량이 도움이 될 것 같아요.'
                : '건강한 체중 감량을 통해 더 건강해질 수 있어요.'
              }
            </Text>
          </Box>
        </Alert>
      )}

      <Box bg="gray.50" p={4} borderRadius="md" border="1px" borderColor="gray.200">
        <Text fontSize="sm" color="gray.600" textAlign="center">
          💡 입력하신 정보는 과학적인 공식을 바탕으로 개인 맞춤 칼로리를 계산하는데 사용돼요.
        </Text>
      </Box>
    </VStack>
  );
};

export default BodyMetrics;
