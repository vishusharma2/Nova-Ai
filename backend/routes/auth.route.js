import express from 'express';
import UserController from "../controllers/userController.js";
import { protect } from '../middleware/auth.middleware.js';

const userRouter = express.Router();

// --- Public routes ---
userRouter.post('/signup', UserController.signup);
userRouter.post('/login', UserController.login);

// --- Protected routes ---
userRouter.get('/me', protect, UserController.getMe);
// userRouter.put('/profile', protect, UserController.updateProfile);
userRouter.post('/logout', protect, UserController.logout);

// Optional: remove deleteAccount and updateUsage for now if not needed
// userRouter.delete('/account', protect, UserController.deleteAccount);
// userRouter.post('/usage', protect, UserController.updateUsage);

export default userRouter;
