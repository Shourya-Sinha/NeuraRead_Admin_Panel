import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";

const AddCategoryDialog = ({ open, handleClose, handleAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
 const {isLoading} = useSelector((state)=>state.adminStats);
  const onAddCategory = () => {
    if (!newCategoryName.trim()) return;
    handleAddCategory(newCategoryName);
    setNewCategoryName(""); // Reset input field
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onAddCategory} color="primary">
         {isLoading ? <CircularProgress color="#fff" size={16} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
