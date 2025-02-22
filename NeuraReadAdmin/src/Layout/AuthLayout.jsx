import React, { useEffect } from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/ic_launcher.png";
import backgroudImg from "../assets/backgroud.jpg";
import { useSelector } from "react-redux";
const AuthLayout = () => {
  const navigate = useNavigate();
  const {isLoggedIn} = useSelector((state)=>state.auth);

    useEffect(()=>{
      if(isLoggedIn){
        navigate("/dashboard"); // Navigate to dashboard if user is logged in
      }
    },[isLoggedIn]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
        backgroundImage: `url(${backgroudImg})`, // Set background image
        backgroundSize: "cover", // Ensure image covers the entire area
        backgroundPosition: "center", // Center the image
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.3)', // Lighter overlay for more shiny effect
          backdropFilter: 'blur(3px)', // Stronger blur effect
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add slight shadow to create depth
        }}
      />
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative', // Make sure content stays above the blurred background
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: 3,
          padding: 4,
          textAlign: 'center',
        }}
      >
        {/* Logo Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto",
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#333", mt: 2 }}
          >
            NeuraRead
          </Typography>
          <Typography variant="body1" sx={{ color: "#777" }}>
            Unlock your next great read with NeuraRead! Join now to explore a
            universe of books.
          </Typography>
        </Box>

        {/* Divider */}
        <Divider sx={{ mb: 3 }} />

        {/* Content (Login/Register/Forgot Password) */}
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
