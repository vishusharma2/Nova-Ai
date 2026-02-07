import User from '../models/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateOtp, sendOtpEmail } from '../utils/emailService.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      useCase: user.useCase,
      experience: user.experience,
      preferences: user.preferences,
      createdAt: user.createdAt
    }
  });
};

class UserController {
  static async signup(req, res) {
    try {
      const { username, email, password, useCase, experience } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({ username, email, password, useCase, experience });
      sendTokenResponse(user, 201, res, 'Account created successfully');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle Mongoose validation errors
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join('. ') });
      }
      
      // Handle duplicate key error (e.g., email or username already exists)
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ success: false, message: `${field} already exists` });
      }
      
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }

      email = email.toLowerCase().trim();

      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await user.comparePassword(password.trim());
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid password' });

      sendTokenResponse(user, 200, res, 'Login successful');
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async logout(req, res) {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  // Forgot Password - Step 1: Send OTP to email
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Please provide an email address' });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address' });
      }

      // Generate OTP and set expiry (10 minutes)
      const otp = generateOtp();
      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save({ validateBeforeSave: false });

      // Send OTP email
      await sendOtpEmail(email, otp, user.username);

      res.status(200).json({ 
        success: true, 
        message: 'OTP sent to your email address' 
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP. Please try again.',
        error: err.message, // Include detailed error for debugging
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }

  // Forgot Password - Step 2: Verify OTP
  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
      }

      const user = await User.findOne({ 
        email: email.toLowerCase().trim(),
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      res.status(200).json({ 
        success: true, 
        message: 'OTP verified successfully' 
      });
    } catch (err) {
      console.error('Verify OTP error:', err);
      res.status(500).json({ success: false, message: 'Failed to verify OTP. Please try again.' });
    }
  }

  // Forgot Password - Step 3: Reset Password
  static async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      }

      const user = await User.findOne({ 
        email: email.toLowerCase().trim(),
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
      }

      // Update password (pre-save hook will hash it)
      user.password = newPassword;
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      await user.save();

      res.status(200).json({ 
        success: true, 
        message: 'Password reset successfully. You can now login with your new password.' 
      });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
    }
  }
}

export default UserController;
