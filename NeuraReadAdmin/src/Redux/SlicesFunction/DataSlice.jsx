import { createSlice } from "@reduxjs/toolkit";
import axiosInstances from "../../AxiosInstances/axiosInstance";
import { showSnackbar } from "./AuthSlice";

const initialState = {
  isLoading: false,
  error: false,
  totalUsers: null,
  totalUserswithDetails: [],
  totalContacts: null,
  totalImages: null,
  totalBooks: null,
  totalCategory: null,
  averageBooks: null,
  contactsByUser: [],
  imagesByUser: [],
  allBooksCategory: [],
  allBooks: [],
};

const dataSlice = createSlice({
  name: "adminStats",
  initialState,
  reducers: {
    updateDataIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    updateTotalUsersList(state, action) {
      state.totalUsers = action.payload.totalUsers;
    },
    updateTotalUsersWithDetailsList(state, action) {
      state.totalUserswithDetails = action.payload.totalUserswithDetails;
    },
    updateTotalContacts(state, action) {
      state.totalContacts = action.payload;
    },
    updateTotalImages(state, action) {
      state.totalImages = action.payload;
    },
    updateTotalBooks(state, action) {
      state.totalBooks = action.payload.totalBooks;
    },
    updateTotalCategory(state, action) {
      state.totalCategory = action.payload.totalBookCategories;
    },
    updateAverageBooks(state, action) {
      state.averageBooks = action.payload.averageBooksPerCategory;
    },
    updateContactsByUser(state, action) {
      state.contactsByUser = action.payload;
    },
    updateImagesByUser(state, action) {
      state.imagesByUser = action.payload;
    },
    updateAllBooksCategory(state, action) {
      state.allBooksCategory = action.payload;
    },
    updateCategorySuccess: (state, action) => {
      state.allBooksCategory = action.payload; // Update categories with new state
    },
    updateAllBooks(state, action) {
      state.allBooks = action.payload;
    },
    setCategories: (state, action) => {
      state.allBooksCategory = action.payload;
    },
    addCategory: (state, action) => {
      state.allBooksCategory.push(action.payload); // Add new category to the list
    },
    setBooks: (state, action) => {
      state.allBooks = action.payload;
    },
    addBooks: (state, action) => {
      state.allBooks.push(action.payload); // Add new category to the list
    },
  },
});

export default dataSlice.reducer;

export const {
  updateDataIsLoading,
  updateTotalUsersList,
  updateTotalUsersWithDetailsList,
  updateTotalContacts,
  updateTotalImages,
  updateTotalBooks,
  updateTotalCategory,
  updateAverageBooks,
  updateContactsByUser,
  updateImagesByUser,
  updateAllBooksCategory,
  updateCategorySuccess,
  updateAllBooks,
  setCategories,
  addCategory,
  setBooks,
  addBooks,
} = dataSlice.actions;

export function fetchTotalUsersList() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get("/admin-stats/get-total-users");

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateTotalUsersList({ totalUsers: response.data.totalUsers }));

      dispatch(
        updateTotalUsersWithDetailsList({
          totalUserswithDetails: response.data.users,
        })
      );

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalContacts() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        "/admin-stats/get-total-contacts"
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateTotalContacts(response.data.totalContacts));

      // console.log("response contacts in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalImages() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        "/admin-stats/get-total-images"
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateTotalImages(response.data.totalImages));

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalBooks() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get("/admin-stats/get-total-books");

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateTotalBooks({ totalBooks: response.data.totalBooks }));

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalCategories() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        "/admin-stats/get-total-book-categories"
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(
        updateTotalCategory({
          totalBookCategories: response.data.totalBookCategories,
        })
      );

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalAverageBooks() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        "/admin-stats/get-avaerage-books"
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(
        updateAverageBooks({
          averageBooksPerCategory: response.data.averageBooksPerCategory,
        })
      );

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalContactsByUser(userId) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        `/admin-stats/get-specific-user-contacts/${userId}`
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateContactsByUser(response.data.contacts));

      console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalImagesByUser(userId) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get(
        `/admin-stats/get-specific-user-gallery/${userId}`
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateImagesByUser(response.data.photos));

      console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalBooksCategory() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get("/book-admin/get-all-category");

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateAllBooksCategory(response.data.categories));

      //   console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      //   dispatch(showSnackbar({ message, severity }));
      //   console.log("error fetching total user data", error);
      return Promise.reject({ severity, message });
    }
  };
}

export const removeCategory = (categoryId) => (dispatch, getState) => {
  const { allBooksCategory } = getState().adminStats;
  console.log("deleted category id", categoryId);
  // Filter out the deleted category
  const updatedCategories = allBooksCategory.filter(
    (category) => category._id !== categoryId
  );
  console.log("deleted category id sucess filter", categoryId);
  // Update Redux state
  dispatch(updateAllBooksCategory(updatedCategories));
  console.log("deleted and update ", categoryId);
};

export function deleteCategoryById(id) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.delete(
        `/book-admin/delete-category/${id}`
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(removeCategory(id));

      console.log("Category deleted successfully", response.data);
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      return Promise.reject({ severity, message });
    }
  };
}

export function updateCategoryById(formData, id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.put(
        `/book-admin/update-category/${id}`,
        formData
      );
      const updatedCategory = response.data.category;

      // Update Redux state instantly
      const { allBooksCategory } = getState().adminStats;
      const updatedCategories = allBooksCategory.map((category) =>
        category._id === id ? { ...category, ...updatedCategory } : category
      );

      dispatch(updateCategorySuccess(updatedCategories)); // Dispatch the updated categories
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Update failed";

      return Promise.reject({ severity, message });
    }
  };
}

export function getAllBooksForAdmin() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get("/user/get-all-books");
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      dispatch(updateAllBooks(response.data.allbooks));
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Update failed";

      return Promise.reject({ severity, message });
    }
  };
}

export function addNewCategory(formData) {
  return async (dispatch) => {
    // console.log('formdata in slice',formData);
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "/book-admin/create-category",
        formData
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Category Add successful!";
      const severity = response.data?.status || "success";

      const newCategory = response.data?.category; // Make sure to return the new category from the response
      dispatch(addCategory(newCategory));

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Update failed";

      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function createNewBooks(formData) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "/book-admin/upload-books",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message || response.data?.msg || "Book Add successful!";
      const severity = response.data?.status || "success";
      const newBook = response.data?.book; // Make sure to return the new book from the response
      dispatch(addBooks(newBook));
      dispatch(showSnackbar({ message, severity }));
    } catch {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Update failed";

      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function updateBookById(bookId, formData) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    console.log("Book ID:", bookId); // Ensure the ID is not undefined here
    try {
      if (!bookId) {
        throw new Error("Book ID is undefined");
      }
      const response = await axiosInstances.put(
        `/book-admin/update-books/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      return response.data.updatedBook;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Update failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export const removeBooks = (bookId) => (dispatch, getState) => {
  const { allBooks } = getState().adminStats;
  console.log("Deleted book ID:", bookId);

  // Filter out the deleted book
  const updatedBooks = allBooks.filter((book) => book._id !== bookId);
  console.log("Deleted book successfully filtered", bookId);

  // Update Redux state
  dispatch(updateAllBooks(updatedBooks));
  console.log("Updated Redux state after deletion");
};

export function deleteBookById(bookId) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    console.log("Book ID:", bookId);  // Ensure the ID is passed
    try {
      if (!bookId) {
        throw new Error("Book ID is undefined");
      }
      const response = await axiosInstances.delete(
        `/book-admin/delete-books/${bookId}`
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      dispatch(removeBooks(bookId)); // Update Redux state after successful deletion
      return response.data.message;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}
