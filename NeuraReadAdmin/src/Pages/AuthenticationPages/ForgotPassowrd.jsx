import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ForgotPasswordFunction } from "../../Redux/SlicesFunction/AuthSlice";
const ForgotPassowrd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      const data = await dispatch(ForgotPasswordFunction({ email })); // Ensure email is sent as an object
      console.log("data in page", data);
      if (data.status === "success") {
        navigate("/auth/reset-password");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
    }
  };
  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Forgot Password
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter your Email"
          type="email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null); // Reset error when user starts typing
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
        >
          {isLoading ? <CircularProgress color="#fff" size={28} /> : "Send OTP"}
        </Button>
      </form>

      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={() => navigate("/auth/login")}
      >
        Remembered your password? Login
      </Button>
    </>
  );
};

export default ForgotPassowrd;
