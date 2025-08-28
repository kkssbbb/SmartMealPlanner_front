import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Link,
  Divider,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const Footer: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box bg={bg} borderTop="1px" borderColor={borderColor} mt={16}>
      <Container maxW="7xl" py={12}>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap={8}
        >
          {/* 회사 정보 */}
          <GridItem>
            <VStack align="flex-start" spacing={4}>
              <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                🍽️ 스마트 식단 추천 서비스
              </Text>
              <Text fontSize="sm" color={textColor} lineHeight="1.6">
                예산과 목표에 맞는 맞춤 레시피를 추천하고, 필요한 재료를 쿠팡에서 바로 구매할 수 있는 스마트 식단 추천 서비스입니다.
              </Text>
              <Text fontSize="xs" color={textColor}>
                © 2025 스마트 식단 추천 서비스. All rights reserved.
              </Text>
            </VStack>
          </GridItem>

          {/* 서비스 */}
          <GridItem>
            <VStack align="flex-start" spacing={3}>
              <Text fontSize="md" fontWeight="bold" color={headingColor}>
                서비스
              </Text>
              <VStack align="flex-start" spacing={2}>
                <Link href="/" fontSize="sm" color={textColor} _hover={{ color: 'teal.500' }}>
                  식단 추천
                </Link>
              </VStack>
            </VStack>
          </GridItem>

          {/* 고객지원 */}
          <GridItem>
            <VStack align="flex-start" spacing={3}>
              <Text fontSize="md" fontWeight="bold" color={headingColor}>
                고객지원
              </Text>
              <VStack align="flex-start" spacing={2}>
                <Link href="#" fontSize="sm" color={textColor} _hover={{ color: 'teal.500' }}>
                  문의하기
                </Link>
                <Link href="#" fontSize="sm" color={textColor} _hover={{ color: 'teal.500' }}>
                  이용약관
                </Link>
                <Link href="#" fontSize="sm" color={textColor} _hover={{ color: 'teal.500' }}>
                  개인정보처리방침
                </Link>
              </VStack>
            </VStack>
          </GridItem>

          {/* 파트너십 */}
          <GridItem>
            <VStack align="flex-start" spacing={3}>
              <Text fontSize="md" fontWeight="bold" color={headingColor}>
                파트너십
              </Text>
              <VStack align="flex-start" spacing={2}>
                <HStack spacing={1}>
                  <Link 
                    href="https://www.coupang.com" 
                    isExternal 
                    fontSize="sm" 
                    color={textColor} 
                    _hover={{ color: 'teal.500' }}
                  >
                    쿠팡 파트너스
                  </Link>
                  <Icon as={ExternalLinkIcon} boxSize={3} color={textColor} />
                </HStack>
                <Text fontSize="xs" color={textColor} lineHeight="1.4">
                  이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </Text>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>

        <Divider my={8} borderColor={borderColor} />

        {/* 하단 정보 */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <GridItem>
            <Text fontSize="xs" color={textColor}>
              제작자: 김승빈
            </Text>
            <Text fontSize="xs" color={textColor}>
                문의: natty0337@gmail.com
              </Text>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
