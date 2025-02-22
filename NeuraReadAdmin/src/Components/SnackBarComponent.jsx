import React from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import { CloseSnackBar } from "../Redux/SlicesFunction/AuthSlice"; // Ensure correct path

const vertical = "bottom";
const horizontal = "center";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const { severity, message, open } = useSelector(
    (state) =>
      state.auth.snackbar || { severity: null, message: null, open: false }
  );

  if (!message || !open) return null; // Avoid unnecessary renders

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={4000}
      key={vertical + horizontal}
      onClose={() => dispatch(CloseSnackBar())}
    >
      <Alert
        onClose={() => dispatch(CloseSnackBar())}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
