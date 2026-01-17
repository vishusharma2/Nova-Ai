import express from 'express';
import UserController from '../controllers/userController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public routes ---
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

// --- Forgot Password routes (public) ---
router.post('/forgot-password', UserController.forgotPassword);
router.post('/verify-otp', UserController.verifyOtp);
router.post('/reset-password', UserController.resetPassword);

// --- Protected route for logout ---
router.post('/logout', protect, UserController.logout);

export default router;
