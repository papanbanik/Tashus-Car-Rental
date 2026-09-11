'use client';

import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#800080',
    },
    secondary: {
      main: '#F1F2EF',
    },
    info: {
      main: '#90e0ef',
    },
    success: {
      main: '#5C8D07',
    },
    warning: {
      main: '#fcbf49',
    },
    error: {
      main: '#f87272',
    },
  },
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Satoshi, sans-serif !important',
        },
      },
    },
  },
  //   typography: {
  //   fontFamily: [
  //     'Poppins',
  //   ].join(','),
  // },
});

export default defaultTheme;
