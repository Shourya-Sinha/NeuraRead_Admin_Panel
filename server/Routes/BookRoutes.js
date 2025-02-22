import { Router } from "express";
import { adminProtectRoute, createBookCategory, deleteBook, deleteBookCategory, fetchAdminProfile, getAllBookCategories, getAllUser, getSingleBookCategory, getUserById, protectRoute, updateBook, updateBookCategory, upload, uploadBookAndCover } from "../Controller/AdminController.js";

const router = Router();

router.post('/upload-books',protectRoute,adminProtectRoute,upload,uploadBookAndCover);
router.put('/update-books/:bookId',protectRoute,adminProtectRoute,upload,updateBook);
router.delete('/delete-books/:bookId',protectRoute,adminProtectRoute,deleteBook);
router.get('/get-all-user',protectRoute,adminProtectRoute,getAllUser);
router.get('/get-single-user/:userId',protectRoute,adminProtectRoute,getUserById);
// Get all categories
router.post('/create-category',protectRoute,adminProtectRoute,createBookCategory);
router.put('/update-category/:id',protectRoute,adminProtectRoute,updateBookCategory);
router.delete('/delete-category/:id',protectRoute,adminProtectRoute,deleteBookCategory);
router.get("/get-all-category", getAllBookCategories);
// Get a single category by id
router.get("get-single-category/:catId", getSingleBookCategory);
router.get('/get-admin-details',protectRoute,adminProtectRoute,fetchAdminProfile);

export default router;