import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "5rem", fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Oops! Page Not Found.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={()=> navigate('/dashboard')}
        sx={{
          fontSize: "1.2rem",
          padding: "10px 20px",
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
