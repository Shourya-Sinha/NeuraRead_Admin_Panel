import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../../Redux/SlicesFunction/AuthSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoignPage = () => {
  const dispatch = useDispatch(); // use your Redux store's dispatch function here
  const navigate = useNavigate();
  const {isLoading} = useSelector((state)=>state.auth);
  const [showPassword,setShowPassword] = useState(false);
  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log("values", values);
      dispatch(LoginUser(values))
      .then(() => {
        console.log("Login Successful! Navigating to Dashboard...");
        navigate("/dashboard"); // Navigate to login page
      })
      .catch((error) => {
        console.error("Loign failed:", error);
      });
    },
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };



  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Login to Your Account
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          {...formik.getFieldProps("email")}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          {...formik.getFieldProps("password")}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
        >
          {isLoading ? <CircularProgress color="#fff" size={28}  /> : "Login"}
        </Button>
      </form>

      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={() => navigate("/auth/forgot-password")}
      >
        Forgot Password?
      </Button>

      <Button
        variant="text"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/auth/register")}
      >
        Don't have an account? Register
      </Button>
    </>
  );
};

export default LoignPage;
