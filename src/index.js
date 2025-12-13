import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import App from './App';

// Force dark mode
const colorModeManager = {
  type: 'localStorage',
  get: () => 'dark',
  set: () => {},
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

