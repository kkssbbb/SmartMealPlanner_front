import React from 'react';
import {
  HStack,
  VStack,
  Text,
  Circle,
  Box,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { OnboardingStep } from '../../types';

interface ProgressIndicatorProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const activeColor = useColorModeValue('teal.500', 'teal.300');
  const completedColor = useColorModeValue('green.500', 'green.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const activeBg = useColorModeValue('teal.50', 'teal.900');

  const steps = [
    { id: 'goal', label: '목표설정', emoji: '🎯' },
    { id: 'budget', label: '예산설정', emoji: '💰' },
    { id: 'basic_info', label: '기본정보', emoji: '👤' },
  ] as const;

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const getStepStatus = (stepId: OnboardingStep) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'inactive';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return completedColor;
      case 'active': return activeColor;
      default: return inactiveColor;
    }
  };

  return (
    <VStack spacing={4} w="full">
      {/* Progress Bar */}
      <Box w="full" px={4}>
        <Progress
          value={progressPercentage}
          colorScheme="teal"
          size="sm"
          borderRadius="full"
          bg="gray.100"
        />
        <HStack justify="space-between" mt={2}>
          <Text fontSize="xs" color="gray.500">
            시작
          </Text>
          <Text fontSize="xs" color="gray.500">
            {Math.round(progressPercentage)}% 완료
          </Text>
          <Text fontSize="xs" color="gray.500">
            완료
          </Text>
        </HStack>
      </Box>

      {/* Step Indicators */}
      <HStack spacing={0} justify="space-between" w="full" px={4}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';

          return (
            <React.Fragment key={step.id}>
              <VStack spacing={2} flex={1}>
                <Circle
                  size={isActive ? "12" : "10"}
                  bg={isActive ? activeBg : 'transparent'}
                  color={getStepColor(status)}
                  borderWidth={isActive ? "2px" : "1px"}
                  borderColor={getStepColor(status)}
                  transition="all 0.2s"
                  position="relative"
                >
                  {isCompleted ? (
                    <Text fontSize="lg">✓</Text>
                  ) : (
                    <Text fontSize={isActive ? "lg" : "md"}>
                      {step.emoji}
                    </Text>
                  )}
                </Circle>
                
                <Text
                  fontSize="xs"
                  color={getStepColor(status)}
                  fontWeight={isActive ? "bold" : "normal"}
                  textAlign="center"
                  lineHeight="1.2"
                >
                  {step.label}
                </Text>
              </VStack>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <Box
                  flex={1}
                  height="1px"
                  bg={
                    completedSteps.includes(steps[index + 1].id) || 
                    (isCompleted && steps[index + 1].id === currentStep)
                      ? completedColor
                      : inactiveColor
                  }
                  mx={2}
                  mt={-4}
                />
              )}
            </React.Fragment>
          );
        })}
      </HStack>

      {/* Current Step Description */}
      <Box textAlign="center" px={4}>
        <Text fontSize="sm" color="gray.600">
          {currentStep === 'goal' && '원하는 목표를 선택해주세요'}
          {currentStep === 'budget' && '한 달 식비 예산을 설정해주세요'}
          {currentStep === 'basic_info' && '기본 정보를 입력해주세요'}
        </Text>
      </Box>
    </VStack>
  );
};

export default ProgressIndicator;
