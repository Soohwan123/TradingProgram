import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  // primary 색상을 검정색으로 변경
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000',  // primary와 동일하게 설정
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#000000',  // NavBar 색상으로 변경
          '&:hover': {
            backgroundColor: '#1976d2',  // 더 진한 색상
        },
        text: {
          color: '#000000',
          '&:hover': {
            color: '#333333',
          },
        },
      },
    },
  },
}}
);

export default theme;