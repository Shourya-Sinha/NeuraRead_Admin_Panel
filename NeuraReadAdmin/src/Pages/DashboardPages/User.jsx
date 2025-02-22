import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Menu,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalUsersList } from "../../Redux/SlicesFunction/DataSlice";

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { totalUserswithDetails, isLoading, error } = useSelector(
    (state) => state.adminStats
  );

  const users = totalUserswithDetails || [];
  // Filter & Sort Users
  const filteredUsers = users
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNo.includes(searchQuery)
    )
    .sort((a, b) =>
      sortBy === "name"
        ? a.userName.localeCompare(b.userName)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  useEffect(() => {
    dispatch(fetchTotalUsersList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">
          Failed to load users. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4facfe, #00f2fe)",
          color: "white",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        <Typography variant="body1">
          View and manage all registered users.
        </Typography>
      </Box>

      {/* Search & Sorting */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search users..."
          size="small"
          sx={{ width: "70%" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/* Sort Dropdown */}
        <FormControl size="small" sx={{ width: "25%" }}>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="name">Sort by Name</MenuItem>
            <MenuItem value="joined">Sort by Date Joined</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* User Cards */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap={2}
      >
        {filteredUsers.map((user) => (
          <Card
            key={user._id}
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              {/* User Icon */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon fontSize="large" />
                    <Typography variant="h6" fontWeight="bold" ml={1}>
                      {user.userName}
                    </Typography>
                  </Box>
                  {/* User Details */}
                  <Typography variant="body2">📧 {user.email}</Typography>
                  <Typography variant="body2">📞 {user.phoneNo}</Typography>
                  <Typography variant="body2">
                    📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", top: -10 }}>
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVertIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/contacts/${selectedUser._id}`);
            handleMenuClose();
          }}
        >
          View Contacts
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/gallery/${selectedUser._id}`);
            handleMenuClose();
          }}
        >
          View Gallery
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default User;
