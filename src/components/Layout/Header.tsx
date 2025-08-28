import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Container,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,

} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={1000}>
      <Container maxW="7xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* 로고 */}
          <HStack spacing={3} cursor="pointer" onClick={handleLogoClick}>
            <Text fontSize="xl" fontWeight="bold" color="teal.600">
              🍽️
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              스마트 식단 추천 서비스
            </Text>
          </HStack>

          {/* 데스크톱 네비게이션 */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" onClick={() => navigate('/')}>
              홈
            </Button>
            <Button variant="ghost">
              서비스
            </Button>
            <Button variant="ghost">
              고객지원
            </Button>
            <Button variant="ghost">
              가이드
            </Button>
          </HStack>

          {/* 사용자 메뉴 */}
          <HStack spacing={4}>
            <Button size="sm" variant="outline" display={{ base: 'none', md: 'flex' }}>
              로그인
            </Button>
            <Button size="sm" colorScheme="teal" display={{ base: 'none', md: 'flex' }}>
              회원가입
            </Button>
            
            {/* 모바일 메뉴 */}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="메뉴"
                display={{ base: 'flex', md: 'none' }}
              />
              <MenuList>
                <MenuItem onClick={() => navigate('/')}>홈</MenuItem>
                <MenuItem>서비스</MenuItem>
                <MenuItem>고객지원</MenuItem>
                <MenuItem>가이드</MenuItem>
                <MenuItem>로그인</MenuItem>
                <MenuItem>회원가입</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
