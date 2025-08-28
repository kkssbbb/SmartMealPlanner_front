import React from 'react';
import {
  VStack,
  HStack,
  Card,
  CardBody,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Select,
  FormControl,
  FormLabel,
  SimpleGrid,
} from '@chakra-ui/react';
import { UserProfile } from '../../types';

interface BasicInfoProps {
  userProfile: Partial<UserProfile>;
  onProfileUpdate: (update: Partial<UserProfile>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ userProfile, onProfileUpdate }) => {
  return (
    <Card borderRadius="2xl" shadow="lg">
      <CardBody p={8}>
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Text fontSize="4xl">👤</Text>
            <Heading size="lg" color="gray.800">기본 정보</Heading>
            <Text color="gray.600" fontSize="sm">
              정확한 식단 추천을 위해 기본 정보를 입력해주세요
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* 성별 */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">성별</FormLabel>
              <HStack spacing={3}>
                <Button
                  flex={1}
                  variant={userProfile.gender === 'male' ? 'solid' : 'outline'}
                  colorScheme="teal"
                  onClick={() => onProfileUpdate({ gender: 'male' })}
                  size="lg"
                >
                  👨 남성
                </Button>
                <Button
                  flex={1}
                  variant={userProfile.gender === 'female' ? 'solid' : 'outline'}
                  colorScheme="teal"
                  onClick={() => onProfileUpdate({ gender: 'female' })}
                  size="lg"
                >
                  👩 여성
                </Button>
              </HStack>
            </FormControl>

            {/* 나이 */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">나이</FormLabel>
              <NumberInput
                value={userProfile.age || 25}
                onChange={(value) => onProfileUpdate({ age: parseInt(value) || 25 })}
                min={15}
                max={80}
                size="lg"
              >
                <NumberInputField placeholder="나이를 입력하세요" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* 키 */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">키 (cm)</FormLabel>
              <NumberInput
                value={userProfile.height || 170}
                onChange={(value) => onProfileUpdate({ height: parseInt(value) || 170 })}
                min={140}
                max={220}
                size="lg"
              >
                <NumberInputField placeholder="키를 입력하세요" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* 몸무게 */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">몸무게 (kg)</FormLabel>
              <NumberInput
                value={userProfile.weight || 70}
                onChange={(value) => onProfileUpdate({ weight: parseInt(value) || 70 })}
                min={40}
                max={150}
                size="lg"
              >
                <NumberInputField placeholder="몸무게를 입력하세요" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>

          {/* 활동량 (간소화) */}
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">활동량</FormLabel>
            <Select
              value={userProfile.activityLevel || 'moderately_active'}
              onChange={(e) => onProfileUpdate({ 
                activityLevel: e.target.value as UserProfile['activityLevel'] 
              })}
              size="lg"
              placeholder="활동량을 선택하세요"
            >
              <option value="sedentary">🛋️ 운동 거의 안함 (사무직)</option>
              <option value="lightly_active">🚶‍♂️ 가벼운 활동 (주 1-3회 운동)</option>
              <option value="moderately_active">🏃‍♂️ 보통 활동 (주 3-5회 운동)</option>
              <option value="very_active">💪 활발한 활동 (주 6-7회 운동)</option>
              <option value="extremely_active">🏋️‍♂️ 매우 활발 (하루 2회 이상 운동)</option>
            </Select>
          </FormControl>

          {/* 안내 메시지 */}
          <Card bg="blue.50" borderRadius="lg">
            <CardBody p={4}>
              <Text fontSize="sm" color="blue.700" textAlign="center">
                💡 <strong>정확한 정보일수록 더 맞춤화된 식단을 추천받을 수 있어요!</strong>
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BasicInfo;
