import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',  // NavBar의 하늘색으로 변경
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2196f3',  // primary와 동일하게 설정
      light: '#64b5f6',
      dark: '#1976d2',
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
          backgroundColor: '#2196f3',  // NavBar 색상으로 변경
          '&:hover': {
            backgroundColor: '#1976d2',  // 더 진한 색상
          },
        },
      },
    },
  },
});

export default theme;