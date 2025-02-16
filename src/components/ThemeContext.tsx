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
    primary: {
      main: '#00AEEF',
      contrastText: '#EAEAEA'
    },
    secondary: {
      main: '#A933FF'
    },
    background: {
      default: "#121212",
      paper: '#181A1B'
    },
    text: {
      primary: "#EAEAEA",
      secondary: "#A0A0A0"
    },
    success: {
      main: "#00FF9F",
    },
    warning: {
      main: "#FFAE00",
    },
    error: {
      main: "#FF007F",
    },
    info: {
      main: "#00FFFF",
    },
    divider: "rgba(255, 255, 255, 0.12)"
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "6px 16px",
          fontWeight: "bold",
          textTransform: "none",
          boxShadow: "0px 0px 8px rgba(0, 174, 239, 0.6)",
          "&:hover": {
            boxShadow: "0px 0px 12px rgba(0, 174, 239, 0.9)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "0.5px",
          textShadow: "0px 0px 6px rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
          backdropFilter: "blur(10px)",
          color: "#00AEEF",
          fontWeight: "bold",
          boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0px 0px 14px rgba(255, 255, 255, 0.4)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(24, 26, 27, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          transition: "background 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 174, 239, 0.2)", // Light Electric Blue hover effect
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(8px)", // Frosted glass effect
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#181A1B", // Dark input background
          borderRadius: "6px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00AEEF", // Electric Blue on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#A933FF", // Neon Purple when focused
          },
        },
      },
    },
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

