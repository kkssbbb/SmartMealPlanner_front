import React from 'react';
import {
  VStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';

interface GenderSelectionProps {
  selectedGender?: 'male' | 'female';
  onGenderSelect: (gender: 'male' | 'female') => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
  selectedGender,
  onGenderSelect,
}) => {
  const selectedBg = useColorModeValue('teal.50', 'teal.900');
  const selectedBorder = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const genderOptions = [
    {
      value: 'male' as const,
      label: '남성',
      emoji: '👨',
      description: '남성의 신체 특성에 맞춘 계산',
    },
    {
      value: 'female' as const,
      label: '여성', 
      emoji: '👩',
      description: '여성의 신체 특성에 맞춘 계산',
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Text fontSize="4xl">👋</Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          어떤 분이신가요?
        </Text>
        <Text color="gray.600">
          성별에 따라 기초대사율 계산 방식이 달라져요
        </Text>
      </VStack>

      <SimpleGrid columns={1} spacing={4} maxW="400px" mx="auto" w="full">
        {genderOptions.map((option) => (
          <Card
            key={option.value}
            cursor="pointer"
            onClick={() => onGenderSelect(option.value)}
            bg={selectedGender === option.value ? selectedBg : 'white'}
            borderWidth={selectedGender === option.value ? '2px' : '1px'}
            borderColor={selectedGender === option.value ? selectedBorder : 'gray.200'}
            _hover={{
              bg: selectedGender === option.value ? selectedBg : hoverBg,
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
          >
            <CardBody textAlign="center" py={8}>
              <VStack spacing={3}>
                <Text fontSize="5xl">{option.emoji}</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {option.label}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {option.description}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default GenderSelection;
