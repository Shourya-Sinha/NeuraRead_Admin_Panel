import { loginUser, logoutUser, mobileForgotPassword, mobileVerifyOtp, registerUser, sendLinkForforgotPassword, verifyAndResetPassword } from '../Controller/AuthController.js';
import { Router } from 'express';

const router = Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.post('/send-link',sendLinkForforgotPassword);
router.post('/reset-password',verifyAndResetPassword);
router.post('/mobile-forgot-password',mobileForgotPassword);
router.post('/mobile-reset-password',mobileVerifyOtp);

export default router;