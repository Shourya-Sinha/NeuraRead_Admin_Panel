import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../../Redux/SlicesFunction/AuthSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading} = useSelector((state)=>state.auth);

  const RegisterSchema = Yup.object({
    name: Yup.string().required("User Full Name is Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be between 10-15 digits")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      console.log("values of rergister", values);
      dispatch(RegisterUser(values))
        .then(() => {
          console.log("Registration Successful! Navigating to Login...");
          navigate("/auth/login"); // Navigate to login page
        })
        .catch((error) => {
          console.error("Registration failed:", error.message);
        });
    },
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Create a New Account
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Full Name"
          type="text"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
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
          label="Phone Number with Coutry Code (Avoid Country Code if Indian)"
          type="tel"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          {...formik.getFieldProps("phone")}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? <CircularProgress color="#fff" size={28}  /> : "Register"}
        </Button>
      </form>

      <Button
        variant="text"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/auth/login")}
      >
        Already have an account? Login
      </Button>
    </>
  );
};

export default RegisterPage;
