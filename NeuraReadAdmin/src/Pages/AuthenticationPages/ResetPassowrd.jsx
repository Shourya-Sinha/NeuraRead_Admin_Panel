import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { VerifyOtpFunction } from "../../Redux/SlicesFunction/AuthSlice";
import { useNavigate } from "react-router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const ResetPassowrd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useSelector((state) => state.auth); // Fix useSelector

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure values from formData
    const { email, otp, newPassword } = formData;

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      console.log('formadata in page ui:-',formData);
      const data = await dispatch(VerifyOtpFunction(formData)); // Await API response
      if (data.status === "success") {
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev); // ✅ Correct syntax
  };
  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reset Password
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
          name="email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Enter OTP"
          name="otp"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.otp}
          onChange={handleInputChange}
        />
        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"} // ✅ Fixed typo
          name="newPassword"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.newPassword}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress color="#fff" size={28} />
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </>
  );
};

export default ResetPassowrd;
