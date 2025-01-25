import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: "3rem", 
      lineHeight: 1.2, 
    },
    h2: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: "2rem",
    },
    body1: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: "1rem",
    },
  },
});

const ThemeContext = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeContext;
