import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsSizeOverrides {
    "x-large": true; // Add "x-large" as a valid option
  }
}

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
      fontSize: "2.4rem",
    },
    h3: {
      fontSize: "2rem"
    },
    h4: {
      fontSize: '1.6rem'
    },
    h5: {
      fontSize: '1.4rem'
    },
    h6: {
      fontSize: '1.2rem'
    },
    body1: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: "1rem",
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiSvgIcon: {
      variants: [
        {
          props: {
            fontSize: "x-large"
          },
          style: {
            fontSize: "40px"
          }
        }
      ]
    }
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

