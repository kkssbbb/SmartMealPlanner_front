import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProvider } from './context/AppContext';
import InputScreen from './components/InputScreen';
import RecommendationScreen from './components/RecommendationScreen';
import ProductDetailScreen from './components/ProductDetailScreen';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<InputScreen />} />
            <Route path="/recommendations" element={<RecommendationScreen />} />
            <Route path="/product/:productId" element={<ProductDetailScreen />} />
          </Routes>
        </Router>
      </AppProvider>
    </ChakraProvider>
  );
};

export default App;
