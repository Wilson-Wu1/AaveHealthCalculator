import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

const colors = {
  dark: {
    bg: {
      50: '#0a0a0a',
      100: '#1a1a1a',
      200: '#2d2d2d',
      300: '#3d3d3d',
      400: '#4d4d4d',
    },
    text: {
      50: '#f5f5f5',
      100: '#e5e5e5',
      200: '#d5d5d5',
      300: '#c5c5c5',
    },
    border: {
      50: 'rgba(235, 235, 239, 0.1)',
      100: 'rgba(235, 235, 239, 0.2)',
      200: 'rgba(235, 235, 239, 0.3)',
    },
  },
};

const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: '#0a0a0a',
      100: '#1a1a1a',
      200: '#2d2d2d',
      300: '#3d3d3d',
      400: '#4d4d4d',
      500: '#6d6d6d',
      600: '#8d8d8d',
      700: '#adadad',
      800: '#cdcdcd',
      900: '#ededed',
    },
    blue: {
      50: '#ebf8ff',
      100: '#bee3f8',
      200: '#90cdf4',
      300: '#63b3ed',
      400: '#4299e1',
      500: '#3182ce',
      600: '#2b77cb',
      700: '#2c5282',
      800: '#2a4365',
      900: '#1a365d',
    },
    purple: {
      50: '#faf5ff',
      100: '#e9d8fd',
      200: '#d6bcfa',
      300: '#b794f4',
      400: '#9f7aea',
      500: '#805ad5',
      600: '#6b46c1',
      700: '#553c9a',
      800: '#44337a',
      900: '#322659',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#121212',
        color: colors.dark.text[50],
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: 400,
      },
      '*': {
        color: colors.dark.text[50],
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 400,
        color: colors.dark.text[50],
      },
      variants: {
        solid: {
          bg: 'gray.300',
          color: 'white',
          _hover: {
            bg: 'gray.400',
          },
        },
        outline: {
          borderColor: colors.dark.border[100],
          color: colors.dark.text[50],
          _hover: {
            bg: 'gray.200',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.200',
            color: colors.dark.text[50],
            _hover: {
              bg: 'gray.300',
            },
            _focus: {
              bg: 'gray.300',
              borderColor: 'gray.400',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'gray.200',
          color: colors.dark.text[50],
        },
        overlay: {
          bg: 'blackAlpha.600',
        },
      },
    },
    Box: {
      baseStyle: {
        bg: 'gray.200',
        color: colors.dark.text[50],
      },
    },
    Text: {
      baseStyle: {
        color: colors.dark.text[50],
      },
    },
    Heading: {
      baseStyle: {
        color: colors.dark.text[50],
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderColor: colors.dark.border[100],
        },
      },
    },
    Table: {
      baseStyle: {
        th: {
          color: colors.dark.text[50],
        },
        td: {
          color: colors.dark.text[50],
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: 'gray.200',
          borderColor: colors.dark.border[100],
        },
        item: {
          bg: 'transparent',
          color: colors.dark.text[50],
          _hover: {
            bg: 'gray.300',
          },
          _focus: {
            bg: 'gray.300',
          },
        },
      },
    },
  },
});

export default theme;
