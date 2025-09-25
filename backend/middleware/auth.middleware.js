import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/auth.js';

// Protect routes - Authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from Authorization header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated.'
      });
    }

    // 5) Check if account is locked
    if (currentUser.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked.'
      });
    }

    // 6) Grant access to protected route
    req.user = currentUser;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Check if user is email verified
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature.',
      requiresEmailVerification: true
    });
  }
  next();
};

// Role-based access control
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

// Check if user owns the resource
export const checkOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.'
        });
      }

      if (resource.user && resource.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership.'
      });
    }
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);

    if (currentUser && currentUser.isActive && !currentUser.isLocked) {
      req.user = currentUser;
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};