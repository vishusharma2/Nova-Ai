import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Simplified User Schema for a Chatbot Application
const userSchema = new mongoose.Schema({
  // Basic Authentication Fields
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Chatbot-Specific Fields
  useCase: {
    type: String,
    required: [true, 'Use case is required'],
    enum: {
      values: [
        'Personal Assistant',
        'Business Automation',
        'Customer Support',
        'Content Creation',
        'Research & Learning',
        'Creative Writing',
        'Other'
      ],
      message: 'Please select a valid use case'
    }
  },
  
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: [
        'New to AI',
        'Some Experience',
        'Advanced User',
        'AI Developer'
      ],
      message: 'Please select a valid experience level'
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Chatbot Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en',
      match: [/^[a-z]{2}$/, 'Language must be a 2-character code']
    },
    conversationStyle: {
      type: String,
      enum: ['casual', 'professional', 'creative', 'technical'],
      default: 'casual'
    },
    responseLength: {
      type: String,
      enum: ['short', 'medium', 'detailed'],
      default: 'medium'
    }
  },
  
  // Usage Statistics
  stats: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0 // in minutes
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    favoriteTopics: [{
      topic: String,
      count: {
        type: Number,
        default: 1
      }
    }]
  },
  
  // Security & Verification
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: Date,
  
  // OAuth Integration
  oauth: {
    google: {
      id: String,
      email: String
    },
    github: {
      id: String,
      username: String
    }
  },
  
  // AI Learning Profile
  aiProfile: {
    learningEnabled: {
      type: Boolean,
      default: true
    },
    interests: [String],
    communicationPatterns: {
      preferredGreeting: String,
      commonQuestions: [String],
      responsePatterns: [String]
    },
    contextMemory: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  registrationSource: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  
  // Timestamps (handled automatically)
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  versionKey: false // Remove __v field
});

// Indexes for better query performance
userSchema.index({ 'stats.lastActiveDate': -1 });
userSchema.index({ isActive: 1, isEmailVerified: 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to handle failed login attempts
userSchema.methods.handleFailedLogin = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have reached max attempts (e.g., 5) and it's not already locked, lock account
  const MAX_ATTEMPTS = 5;
  if (this.loginAttempts + 1 >= MAX_ATTEMPTS && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // Lock for 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: {
        loginAttempts: 0
    },
    $unset: {
      lockUntil: 1
    }
  });
};

// Instance method to update usage stats
userSchema.methods.updateUsageStats = function(messageCount = 1, sessionDuration = 0) {
  this.stats.totalMessages += messageCount;
  this.stats.totalConversations += 1; // Assuming each update call corresponds to a new conversation session
  this.stats.lastActiveDate = new Date();
  
  if (sessionDuration > 0) {
    // Calculate rolling average
    const totalSessions = this.stats.totalConversations;
    const currentAvg = this.stats.averageSessionDuration;
    this.stats.averageSessionDuration = ((currentAvg * (totalSessions - 1)) + sessionDuration) / totalSessions;
  }
  
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Static method to get user statistics
userSchema.statics.getUserStats = function(userId) {
  return this.findById(userId).select('stats preferences');
};

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;