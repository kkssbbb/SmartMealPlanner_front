import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex="1" as="main">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
