import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: "#006d77",
      light: "#b8dedc",
      dark: "#001314",
      bg: "#f1f7f9",
      contrastText: "#f1ede7",
    },
    secondary: {
      main: "#d39c76",
      light: "#f6dcc9",
      dark: "#945932",
      contrastText: "#edf6f9",
    },
    info: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#000000",
      contrastText: "#333333",
    },
    warning: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#000000",
      contrastText: "#333333",
    },
    error: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#000000",
      contrastText: "#333333",
    },
    success: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#000000",
      contrastText: "#333333",
    },
  },
});
export default theme;