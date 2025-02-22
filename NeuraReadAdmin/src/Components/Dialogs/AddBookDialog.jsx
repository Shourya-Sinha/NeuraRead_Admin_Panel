import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
const AddBookDialog = ({
  open,
  handleClose,
  handleAddBook,
  formData,
  setFormData,
  categories,
}) => {
  const { isLoading } = useSelector((state) => state.adminStats);
  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const onAddBook = () => {
    if (
      !formData.title ||
      !formData.author ||
      !formData.cover ||
      !formData.book ||
      !formData.category
    ) {
      setError("All fields including Cover Image and PDF are required.");
      return;
    }

    setError(""); // Clear errors if validation passes
    handleAddBook(formData);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] }); // Store file object
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Books</DialogTitle>
      <DialogContent>
        <TextField
          label="Book Title(Name)"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="Author"
          name="author"
          required
          value={formData.author}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <input
          type="file"
          name="cover"
          required
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        />

        {/* File Upload for PDF Book */}
        <input
          type="file"
          name="book"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        />
        {/* You can add a dropdown for category selection here */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Select Category</InputLabel>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            label="Select Category"
          >
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onAddBook} color="primary">
          {isLoading ? <CircularProgress color="#fff" size={16} /> : "Add Book"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookDialog;
