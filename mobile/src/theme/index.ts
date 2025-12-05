import { extendTheme } from 'native-base';

const palette = {
  primary: {
    50: '#e3f2ff',
    100: '#b3d4ff',
    200: '#81b7ff',
    300: '#4f9bff',
    400: '#1d7fff',
    500: '#0466e0',
    600: '#004fb0',
    700: '#003880',
    800: '#002250',
    900: '#000c23'
  },
  secondary: {
    50: '#fff8e5',
    100: '#ffebbf',
    200: '#ffd88f',
    300: '#ffc55e',
    400: '#ffb32e',
    500: '#e69914',
    600: '#b3770e',
    700: '#805508',
    800: '#4e3302',
    900: '#1e1200'
  },
  neutral: {
    50: '#f7f9fb',
    100: '#e9edf2',
    200: '#d9dee7',
    300: '#c8d0db',
    400: '#aeb8c6',
    500: '#8f9bb0',
    600: '#6e7a8c',
    700: '#4f5a67',
    800: '#303a42',
    900: '#121b1d'
  }
};

export const theme = extendTheme({
  colors: palette,
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary'
      }
    }
  },
  config: {
    initialColorMode: 'light'
  }
});

export type ThemeType = typeof theme;
export default theme;
