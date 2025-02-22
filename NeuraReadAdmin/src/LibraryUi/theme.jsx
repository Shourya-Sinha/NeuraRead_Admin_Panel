import { createTheme } from "@mui/material/styles";

// Function to generate a theme dynamically
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
        paper: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
        secondary: mode === "dark" ? "#b0b0b0" : "#4f4f4f",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",

      h1: {
        fontSize: "3.2rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2.4rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.8rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.4,
      },
      button: {
        fontSize: "1rem",
        fontWeight: 600,
        textTransform: "uppercase",
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.3,
      },
      overline: {
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      },
    },
  });
