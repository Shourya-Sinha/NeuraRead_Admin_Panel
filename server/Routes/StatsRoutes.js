import { Router } from 'express';
import { adminProtectRoute, protectRoute } from '../Controller/AdminController.js';
import { getAverageBooksByCategory, getTotalBookCategories, getTotalBooks, getTotalContacts, getTotalImages, getTotalUsers, getUserContacts, getUserImages } from '../Controller/StatsController.js';

const router = Router();

router.get('/get-total-users',protectRoute,adminProtectRoute,getTotalUsers);
router.get('/get-total-contacts',protectRoute,adminProtectRoute,getTotalContacts);
router.get('/get-total-images',protectRoute,adminProtectRoute,getTotalImages);
router.get('/get-total-books',protectRoute,adminProtectRoute,getTotalBooks); 
router.get('/get-total-book-categories',protectRoute,adminProtectRoute,getTotalBookCategories);
router.get('/get-avaerage-books',protectRoute,adminProtectRoute,getAverageBooksByCategory);
router.get('/get-specific-user-contacts/:userId', protectRoute, adminProtectRoute, getUserContacts);
router.get('/get-specific-user-gallery/:userId', protectRoute, adminProtectRoute, getUserImages);

export default router;