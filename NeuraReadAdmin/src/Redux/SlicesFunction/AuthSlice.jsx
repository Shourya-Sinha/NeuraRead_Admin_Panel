import { createSlice } from "@reduxjs/toolkit";
import axiosInstances from "../../AxiosInstances/axiosInstance";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
  error: false,
  adminData:{},
  snackbar: {
    open: false,
    severity: null,
    message: null,
  },
};

const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openSnackBar(state, action) {
      console.log("Snackbar payload:", action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    CloseSnackBar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
      state.snackbar.severity = null;
    },
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    login: (state, action) => {
      console.log("Login payload:", action.payload);
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user || null;
    },
    logout: (state) => {
      // Reset everything to initial state on logout
      state.isLoggedIn = false;
      state.user = {};
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
    updateAdminData: (state, action) => {
      state.adminData = action.payload;
    },
  },
});

export default authSlices.reducer; // ✅ Now exported as `authSlice.reducer`
export const { updateIsLoading, openSnackBar, CloseSnackBar, login, logout,updateAdminData } =
  authSlices.actions;

export function LogoutUser() {
  return async (dispatch) => {
    try {
      const response = await axiosInstances.post("/auth/logout");

      dispatch(logout());

      // Use API response message dynamically
      const message =
        response.data?.message || response.data?.msg || "Logout successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Logout failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export const showSnackbar =
  ({ severity, message }) =>
  (dispatch) => {
    dispatch(openSnackBar({ message, severity }));

    setTimeout(() => {
      dispatch(CloseSnackBar());
    }, 4000);
  };

export function LoginUser(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post("/auth/login", {
        ...formValues,
      });
      const token = response.data?.user?.token;
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      dispatch(
        login({
          isLoggedIn: true,
          user: response.data.user,
          token: token,
        })
      );
      const message =
        response.data?.message || response.data?.msg || "Login successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      // console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function RegisterUser(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.post("/auth/register", formValues);

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Registration successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      // Log the entire error response to understand its structure
      // console.log('Full error response:', error.response);

      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Registration failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function ForgotPasswordFunction(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.post(
        "/auth/mobile-forgot-password",
        { email: formValues }, // Ensure this is the correct format
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Otp sent successful in your Email!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Failed to send OTP";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function VerifyOtpFunction(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    console.log("formvalues in slice fucntion:-", formValues);
    try {
      const response = await axiosInstances.post(
        "/auth/mobile-reset-password",
        formValues
      );

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Passowrd Reset Successfully!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Failed to send OTP";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function GetAdminData() {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get(
        "/book-admin/get-admin-details"
      );
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      dispatch(updateAdminData(response.data.user));
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Failed to send OTP";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}
