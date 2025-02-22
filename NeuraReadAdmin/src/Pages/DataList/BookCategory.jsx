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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QueueIcon from '@mui/icons-material/Queue';
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCategory,
  deleteCategoryById,
  fetchTotalBooksCategory,
  updateCategoryById,
} from "../../Redux/SlicesFunction/DataSlice";
import AddCategoryDialog from "../../Components/Dialogs/AddCategoryDialog";

const BookCategory = () => {
  const dispatch = useDispatch();
  const { allBooksCategory, isLoading, error } = useSelector(
    (state) => state.adminStats
  );
  const categories = allBooksCategory || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categoriesList, setCategoriesList] = useState(categories);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null); // Holds the category being edited
  const [updatedCategoryName, setUpdatedCategoryName] = useState(""); // Holds the updated name
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null); // Holds the category ID for the loader
  const [openEditModal, setOpenEditModal] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTotalBooksCategory());
  }, [dispatch]);

  useEffect(() => {
    setCategoriesList(allBooksCategory || []);
  }, [allBooksCategory]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setUpdatedCategoryName(category.name);
    setOpenEditModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setOpenEditModal(false);
    setEditingCategory(null);
    setUpdatedCategoryName("");
  };

  const handleAddCategory = async (categoryName) => {
    try {
      await dispatch(addNewCategory({ categoryName: categoryName }));
      setOpenAddModal(false); // Close dialog after adding
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Function to handle deleting a category
  const handleDelete = async (categoryId) => {
    setDeletingCategoryId(categoryId);
    try {
      await dispatch(deleteCategoryById(categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingCategoryId(null); // Hide loader after deletion
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !updatedCategoryName.trim()) return;

    setUpdatingCategoryId(editingCategory._id); // Show loader for this category

    try {
      await dispatch(
        updateCategoryById(
          { categoryName: updatedCategoryName },
          editingCategory._id
        )
      );
      setOpenEditModal(false); // Close modal on success
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setUpdatingCategoryId(null); // Hide loader after update
    }
  };

  // Filter categories based on search query and sort by name
  const filteredAndSortedCategories = categoriesList
    .filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : 0));

  return (
    <>
      <Box sx={{ padding: 4 }}>
       <Stack direction={'row'} justifyContent={'space-between'} px={2} alignItems={'center'}>
       <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 4 }}>
          Book Categories
        </Typography>

       <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <Typography variant="h6">Add New Category</Typography>
       <IconButton onClick={() => setOpenAddModal(true)}>
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
            Failed to fetch contacts. Please try again later.
          </Typography>
        )}

        {/* Search & Sorting */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search categories..."
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
            </Select>
          </FormControl>
        </Box>

        {/* Category list */}
        <Grid container spacing={3}>
          {filteredAndSortedCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

                {/* Edit/Delete buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    top: 20,
                    right: 10,
                  }}
                >
                  <IconButton
                    onClick={() => handleEdit(category)}
                    sx={{ marginRight: 1 }}
                  >
                    {updatingCategoryId === category._id ? <CircularProgress size={16} /> : <EditIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category._id)}>
                    {deletingCategoryId === category._id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={openEditModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            color="primary"
            disabled={updatingCategoryId === editingCategory?._id}
          >
            {updatingCategoryId === editingCategory?._id ? (
              <CircularProgress size={18} />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <AddCategoryDialog
        open={openAddModal}
        handleClose={handleCloseAddModal}
        handleAddCategory={handleAddCategory}
      />
    </>
  );
};

export default BookCategory;
