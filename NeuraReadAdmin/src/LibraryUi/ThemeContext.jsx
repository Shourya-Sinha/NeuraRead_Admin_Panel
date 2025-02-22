import { createContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme.jsx";
import { CssBaseline } from "@mui/material";

// Create context
export const ThemeModeContext = createContext();

const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
    };

    // Memoized theme for performance
    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};

export default ThemeModeProvider;
