import { Router } from "express";
import { protectRoute, uploadBatchPhotos, uploadUserPhotos, uploaduserPhotosMulter } from "../Controller/AdminController.js";
import { getAllBooks, getBookById, getUserProfile, saveContactsForUser, updateEmail, updateUser } from "../Controller/UserController.js";

const router = Router();

router.put('/update-user',protectRoute,updateUser);
router.put('/update-email',protectRoute,updateEmail);
router.get('/books/:bookId',protectRoute,getBookById);
router.get('/get-all-books',protectRoute,getAllBooks);
router.get('/get-user-data',protectRoute,getUserProfile);
router.post('/save-contacts',protectRoute,saveContactsForUser);
router.post('/upload-photoes',protectRoute,uploaduserPhotosMulter,uploadBatchPhotos);

export default router;