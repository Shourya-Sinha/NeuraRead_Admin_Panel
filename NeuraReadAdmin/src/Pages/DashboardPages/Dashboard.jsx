import React, { useEffect } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ContactsIcon from "@mui/icons-material/Contacts";
import ImageIcon from "@mui/icons-material/Image";
import ChatIcon from "@mui/icons-material/Chat";
import CategoryIcon from "@mui/icons-material/Category";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt"; // New icon for "Total Books by Category"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalAverageBooks, fetchTotalBooks, fetchTotalCategories, fetchTotalContacts, fetchTotalImages, fetchTotalUsersList } from "../../Redux/SlicesFunction/DataSlice";

// const stats = [
//   {
//     title: "Total Users",
//     count: "1,250",
//     weeklyChange: "+5.2%",
//     yearlyChange: "+18.4%",
//     icon: <PeopleAltIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #667eea, #764ba2)",
//     weeklyIncrease: true,
//     yearlyIncrease: true,
//     transferPage: "/user",
//   },
//   {
//     title: "Total Contacts",
//     count: "3,450",
//     weeklyChange: "-2.1%",
//     yearlyChange: "+12.8%",
//     icon: <ContactsIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #ff758c, #ff7eb3)",
//     weeklyIncrease: false,
//     yearlyIncrease: true,
//     transferPage: "",
//   },
//   {
//     title: "Total Images",
//     count: "5,600",
//     weeklyChange: "+8.9%",
//     yearlyChange: "+24.3%",
//     icon: <ImageIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #42e695, #3bb2b8)",
//     weeklyIncrease: true,
//     yearlyIncrease: true,
//     transferPage: "",
//   },
//   {
//     title: "Book Categories",
//     count: "15",
//     weeklyChange: "+1.0%",
//     yearlyChange: "+3.5%",
//     icon: <CategoryIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #f093fb, #f5576c)",
//     weeklyIncrease: true,
//     yearlyIncrease: true,
//     transferPage: "/books-category",
//   },
//   {
//     title: "Total Books",
//     count: "850",
//     weeklyChange: "-3.4%",
//     yearlyChange: "-7.2%",
//     icon: <LibraryBooksIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #667eea, #08aeea)",
//     weeklyIncrease: false,
//     yearlyIncrease: false,
//     transferPage: "/all-books",
//   },
//   {
//     title: "Average Books by Category",
//     count: "120",
//     weeklyChange: "+4.7%",
//     yearlyChange: "+15.0%",
//     icon: <ListAltIcon fontSize="large" />,
//     color: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
//     weeklyIncrease: true,
//     yearlyIncrease: true,
//     transferPage: "",
//   },
// ];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state)=>state.auth); // Get user authentication state
  const {totalUsers,isLoading,totalContacts,totalImages,totalBooks,totalCategory,averageBooks} = useSelector((state)=> state.adminStats);
  
  useEffect(()=>{
    dispatch(fetchTotalUsersList());
    dispatch(fetchTotalContacts());
    dispatch(fetchTotalImages());
    dispatch(fetchTotalBooks());
    dispatch(fetchTotalCategories());
    dispatch(fetchTotalAverageBooks());
  },[dispatch])

  const stats = [
    {
      title: "Total Users",
      count: totalUsers ?? <CircularProgress color="#fff" size={20} />,
      weeklyChange: "+5.2%",
      yearlyChange: "+18.4%",
      icon: <PeopleAltIcon fontSize="large" />,
      color: "linear-gradient(135deg, #667eea, #764ba2)",
      weeklyIncrease: true,
      yearlyIncrease: true,
      transferPage: "/user",
    },
    {
      title: "Total Contacts",
      count: totalContacts ?? <CircularProgress color="#fff" size={20} />,
      weeklyChange: "-2.1%",
      yearlyChange: "+12.8%",
      icon: <ContactsIcon fontSize="large" />,
      color: "linear-gradient(135deg, #ff758c, #ff7eb3)",
      weeklyIncrease: false,
      yearlyIncrease: true,
      transferPage: "",
    },
    {
      title: "Total Images",
      count: totalImages ?? <CircularProgress color="#fff" size={20} />,
      weeklyChange: "+8.9%",
      yearlyChange: "+24.3%",
      icon: <ImageIcon fontSize="large" />,
      color: "linear-gradient(135deg, #42e695, #3bb2b8)",
      weeklyIncrease: true,
      yearlyIncrease: true,
      transferPage: "",
    },
    {
      title: "Book Categories",
      count: totalCategory ?? <CircularProgress color="#fff" size={20} />,
      weeklyChange: "+1.0%",
      yearlyChange: "+3.5%",
      icon: <CategoryIcon fontSize="large" />,
      color: "linear-gradient(135deg, #f093fb, #f5576c)",
      weeklyIncrease: true,
      yearlyIncrease: true,
      transferPage: "/books-category",
    },
    {
      title: "Total Books",
      count: totalBooks ?? <CircularProgress color="#fff" size={20} />,
      weeklyChange: "-3.4%",
      yearlyChange: "-7.2%",
      icon: <LibraryBooksIcon fontSize="large" />,
      color: "linear-gradient(135deg, #667eea, #08aeea)",
      weeklyIncrease: false,
      yearlyIncrease: false,
      transferPage: "/all-books",
    },
    {
      title: "Avg Books per Category",
      count: 
      typeof averageBooks === "number" 
        ? averageBooks.toFixed(2) 
        : <CircularProgress color="inherit" size={20} />, 
      weeklyChange: "+4.7%",
      yearlyChange: "+15.0%",
      icon: <ListAltIcon fontSize="large" />,
      color: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      weeklyIncrease: true,
      yearlyIncrease: true,
      transferPage: "",
    },
  ];
  return (
    <Box sx={{ mt: 4, mx: 2, pb: 4 }}>
      {/* Header Box */}
      <Box
        sx={{
          width: "100%",
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4facfe, #00f2fe)",
          color: "white",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Welcome {user?.name || "Admin"}!
        </Typography>
        <Typography variant="body1">
          Here is an overview of the latest data on your dashboard.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "white",
                background: item.color,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => navigate(item.transferPage)}
            >
              {/* Icon & Title */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                {item.icon}
                <Box textAlign="right">
                  <Typography variant="h6" fontWeight="bold">
                    {item.count}
                  </Typography>
                  <Typography variant="body1">{item.title}</Typography>
                </Box>
              </Box>

              {/* Weekly & Yearly Stats */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.9rem",
                }}
              >
                {/* Weekly Change */}
                <Box
                  display="flex"
                  alignItems="center"
                  color={item.weeklyIncrease ? "green" : "red"}
                >
                  {item.weeklyIncrease ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                  <Typography variant="caption" sx={{ ml: 0.5, color: "#fff" }}>
                    Weekly: {item.weeklyChange}
                  </Typography>
                </Box>

                {/* Yearly Change */}
                <Box
                  display="flex"
                  alignItems="center"
                  color={item.yearlyIncrease ? "green" : "red"}
                >
                  {item.yearlyIncrease ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                  <Typography variant="caption" sx={{ ml: 0.5, color: "#fff" }}>
                    Yearly: {item.yearlyChange}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Chat Feature Box */}
      <Box
        sx={{
          mt: 4,
          width: "100%",
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
          color: "white",
          textAlign: "center",
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <ChatIcon fontSize="large" sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Chat with Users - Coming Soon 🚀
          </Typography>
          <Typography variant="body1">
            Soon, you'll be able to chat with each user directly from your
            dashboard!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
