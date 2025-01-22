import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
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
