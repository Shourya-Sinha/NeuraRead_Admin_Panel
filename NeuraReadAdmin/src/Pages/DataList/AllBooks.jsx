import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewBooks,
  deleteBookById,
  fetchTotalBooksCategory,
  getAllBooksForAdmin,
  updateBookById,
} from "../../Redux/SlicesFunction/DataSlice";
import QueueIcon from "@mui/icons-material/Queue";
import AddBookDialog from "../../Components/Dialogs/AddBookDialog";
import EditBookDialog from "../../Components/Dialogs/EditBookDialog";

const AllBooks = () => {
  const dispatch = useDispatch();
  const { allBooks, isLoading, error, allBooksCategory } = useSelector(
    (state) => state.adminStats
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [booksList, setBooksList] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false); // State to open/close the AddBookDialog
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editBookId, setEditBookId] = useState(null); // Holds the book ID for the edit dialog
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cover: "",
    book: "",
    category: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    cover: "",
    book: "",
    category: "",
  });

  useEffect(() => {
    dispatch(getAllBooksForAdmin());
    dispatch(fetchTotalBooksCategory());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allBooks) && allBooks.length > 0) {
      setBooksList(allBooks);
    }
  }, [allBooks]);

  // Function to handle deleting a book
  const handleDelete = async (bookId) => {
    try {
      setDeleteId(bookId); // Set the book ID as the current one being deleted
      await dispatch(deleteBookById(bookId)); // Delete the book via Redux
      // No need to filter locally since Redux is already updating the state
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setDeleteId(null); // Reset the deleteId when done, regardless of success/failure
    }
  };

  // Filter books based on search query and sort them
  const filteredAndSortedBooks = (booksList || [])
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(book.createdAt)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "author") {
        return a.author.localeCompare(b.author);
      } else if (sortBy === "date") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  // Handle closing the dialog
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleopenEditModal = (book) => {
    console.log("Book to edit:", book); // Check if this is the correct book
    if (book && book._id) {
      setEditBookId(book._id); // Ensure that the book ID is passed correctly
      setEditFormData({
        title: book.title,
        author: book.author,
        cover: book.coverSecureUrl,
        book: book.bookSecureUrl,
        category: book.category,
      });
      setOpenEditDialog(true);
    } else {
      console.error("Invalid book data:", book); // If book or book._id is missing
    }
  };

  const handleCloseEditModal = () => {
    setOpenEditDialog(false);
  };

  const handleAddBook = (formData) => {
    dispatch(createNewBooks(formData)); // Dispatch action to add the new book
    handleCloseAddModal(); // Close the dialog after adding
  };

  const handleUpdateBooks = async (editFormData, editBookId) => {
    console.log("Updating book with ID:", editBookId); // Check if this is correctly logged
    try {
      await dispatch(updateBookById(editBookId, editFormData));
      setBooksList((prevBooks) =>
        prevBooks.map((book) =>
          book._id === editBookId ? { ...book, ...editFormData } : book
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          px={2}
          alignItems={"center"}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 4 }}>
            All Available Books
          </Typography>

          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h6">Add New Books</Typography>
            <IconButton onClick={handleOpenAddModal}>
              <QueueIcon color="primary" />
            </IconButton>
          </Stack>
        </Stack>

        {isLoading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography variant="h6" color="error">
            Failed to fetch Books. Please try again later.
          </Typography>
        )}

        {/* Search & Sorting */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search books by title, author, or date..."
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
              <MenuItem value="title">Sort by Title</MenuItem>
              <MenuItem value="author">Sort by Author</MenuItem>
              <MenuItem value="date">Sort by Date</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Book list */}
        <Grid container spacing={3}>
          {filteredAndSortedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card
                sx={{
                  display: "flex",
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {/* Left side - Book image */}
                <Box sx={{ width: "35%", height: "180px" }}>
                  <img
                    src={book.coverSecureUrl}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.8)", // Dim the image for better text visibility
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Box>

                {/* Right side - Book details */}
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "65%",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {book.title}
                  </Typography>
                  <Typography variant="caption">
                    Author: {book.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#777", fontSize: "0.8rem" }}
                  >
                    Adapting Date:{" "}
                    {new Date(book.createdAt).toLocaleDateString()}
                  </Typography>

                  {/* Edit/Delete buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => handleopenEditModal(book)}
                      sx={{ marginRight: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(book._id)}>
                      {deleteId === book._id ? (
                        <CircularProgress size={12} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <AddBookDialog
        open={openAddModal}
        handleClose={handleCloseAddModal}
        handleAddBook={handleAddBook}
        formData={formData} // Pass formData
        setFormData={setFormData} // Pass setFormData to manage the form fields
        categories={allBooksCategory}
      />

      <EditBookDialog
        open={openEditDialog}
        handleClose={handleCloseEditModal}
        handleUpdateBooks={handleUpdateBooks}
        formData={editFormData}
        setFormData={setEditFormData}
        categories={allBooksCategory}
        editBookId={editBookId} // Pass editBookId
      />
    </>
  );
};

export default AllBooks;
