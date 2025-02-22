import "./App.css";
import ThemeModeProvider from "./LibraryUi/ThemeContext.jsx";
import Router from "./Routes/path.jsx";
import React from "react";
import SnackbarComponent from "./Components/SnackBarComponent.jsx"; // Import the Snackbar component

function App() {
  return (
    <>
      <ThemeModeProvider>
        <Router />
      </ThemeModeProvider>

      {/* ✅ Snackbar is now a separate component */}
      <SnackbarComponent />
    </>
  );
}

export default App;
