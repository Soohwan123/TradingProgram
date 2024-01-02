import { createTheme } from "@mui/material/styles";
export default createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "rgba(255, 255, 255, 1)" },
    background: {
      paper: "rgba(244, 244, 244, 1)",
      default: "rgba(255, 255, 255, 1)",
    },
    primary: {
      light: "rgba(160, 173, 217, 1)",
      main: "rgba(77, 90, 158, 1)",
      dark: "rgba(51, 65, 153, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(251, 187, 208, 1)",
      main: "rgba(191, 89, 125, 1)",
      dark: "rgba(176, 69, 116, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "rgba(202, 24, 46, 1)",
      dark: "rgba(150, 17, 17, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(80, 0, 0, 1)",
      secondary: "rgba(189, 32, 32, 0.54)",
      disabled: "rgba(153, 109, 109, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
