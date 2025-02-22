import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import logo from "../assets/ic_launcher.png"; // Update this path to your logo

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            zIndex: 2, // Makes sure the logo is above the circle
          }}
        />

        {/* Animated Circle */}
        <Box
          sx={{
            position: "absolute",
            border: "3px solid #fff",
            borderRadius: "50%",
            width: "200px",
            height: "200px",
            animation: "spin 2s linear infinite", // Spinning animation
            animationDuration: "3s",
          }}
        />
      </Box>

      {/* Loading Text */}
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          marginTop: 2,
        }}
      >
        Loading...
      </Typography>

      {/* Optional: Add MUI CircularProgress Spinner */}
      <CircularProgress
        sx={{
          color: "#fff",
          marginTop: 2,
        }}
      />
    </Box>
  );
};

export default LoadingScreen;
