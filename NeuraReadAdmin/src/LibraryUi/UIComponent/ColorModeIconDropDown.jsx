import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import IconButton from "@mui/material/IconButton";
import { ThemeModeContext } from "../ThemeContext";

export default function ColorModeIconDropdown(props) {
  const { mode, toggleTheme } = React.useContext(ThemeModeContext);

  const icon = mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />;

  return (
    <React.Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={toggleTheme}
        disableRipple
        size="small"
        aria-controls={open ? "color-scheme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        {...props}
      >
        {icon}
      </IconButton>
    </React.Fragment>
  );
}
