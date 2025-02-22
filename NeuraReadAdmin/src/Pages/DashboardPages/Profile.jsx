import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  Collapse,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GetAdminData } from "../../Redux/SlicesFunction/AuthSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { adminData, isLoading, error } = useSelector((state) => state.auth); // Include error state
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    dispatch(GetAdminData());
  }, [dispatch]);

  const getInitials = (name) => {
    if (!name) return "A"; // Default if no name is available
    const words = name.trim().split(" ");
    return words
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 3); // Max 3 initials
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Failed to load profile. Please try again.
        </Typography>
      </Container>
    );
  }

  if (!adminData || Object.keys(adminData).length === 0) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <Typography color="textSecondary" variant="h6">
          No profile data found.
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
      {/* Header Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Admin Profile
      </Typography>

      {/* Profile Card */}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        {/* Profile Picture */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              boxShadow: 3,
              bgcolor: "primary.main",
              color: "white",
              fontSize: 32,
            }}
          >
            {getInitials(adminData.userName)}
          </Avatar>
        </Box>
        {/* Admin Info */}
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {adminData.userName || "N/A"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {adminData.email || "N/A"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Phone: {adminData.phoneNo || "N/A"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Joined: {new Date(adminData.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>

        {/* Edit Profile Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" color="primary" startIcon={<EditIcon />}>
            Edit Profile
          </Button>
        </Box>
      </Card>

      <Divider sx={{ my: 5 }} />

      {/* Password Reset Section */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        Reset Password
        <ExpandMoreIcon
          sx={{
            ml: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
          }}
        />
      </Typography>

      <Collapse in={open}>
        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To reset your password, please enter a new one below.
            </Typography>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button variant="contained" color="error" fullWidth>
              Reset Password
            </Button>
          </CardContent>
        </Card>
      </Collapse>
    </Container>
  );
};

export default Profile;
