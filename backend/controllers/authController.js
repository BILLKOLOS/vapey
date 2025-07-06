const User = require('../models/User');
const Notification = require('../models/Notification');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt with data:', { 
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
      email: req.body.email, 
      phone: req.body.phone,
      hasPassword: !!req.body.password,
      referralCode: req.body.referralCode 
    });
    
    const { firstName, lastName, email, password, phone, referralCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    // Validate referral code if provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findByReferralCode(referralCode);
      if (!referrer) {
        console.log('Registration failed: Invalid referral code:', referralCode);
        return res.status(400).json({ success: false, message: 'Invalid referral code' });
      }
      referredBy = referrer._id;
    }
    
    // Create user
    console.log('Creating user with data:', { firstName, lastName, email, phone, referredBy });
    const user = new User({ firstName, lastName, email, password, phone, referredBy });
    await user.save();
    
    console.log('User created successfully:', user._id);
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Create welcome notification
    try {
      await Notification.createNotification(user._id, 'system', 'Welcome to VapeY Investment! 🎉', 'Thank you for joining our investment platform. Start your investment journey today!', { icon: '🎉', isImportant: true, actionUrl: '/dashboard', actionText: 'Go to Dashboard' });
    } catch (notificationError) {
      console.error('Failed to create welcome notification:', notificationError);
      // Don't fail registration if notification fails
    }
    
    // Create referral notification if applicable
    if (referredBy) {
      try {
        await Notification.createNotification(referredBy, 'referral', 'New Referral! 👥', `${user.firstName} ${user.lastName} joined using your referral code!`, { icon: '👥', actionUrl: '/referrals', actionText: 'View Referrals' });
      } catch (notificationError) {
        console.error('Failed to create referral notification:', notificationError);
        // Don't fail registration if notification fails
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      data: { 
        user: { 
          id: user._id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email, 
          referralCode: user.referralCode, 
          isVerified: user.isVerified, 
          role: user.role 
        }, 
        token 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error while creating Account',
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      console.log('Duplicate key error:', field, error.keyValue[field]);
      return res.status(400).json({ 
        success: false, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.security.accountLocked) {
      if (user.security.lockExpires && new Date() > user.security.lockExpires) {
        await user.resetFailedLoginAttempts();
      } else {
        return res.status(423).json({ success: false, message: 'Account is temporarily locked due to multiple failed login attempts' });
      }
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementFailedLoginAttempts();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    await user.resetFailedLoginAttempts();
    await user.addLoginHistory(req.ip, req.get('User-Agent'), 'Unknown Location', 'success');
    const token = user.generateAuthToken();
    res.json({ success: true, message: 'Login successful', data: { user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, referralCode: user.referralCode, isVerified: user.isVerified, role: user.role, wallet: user.wallet, lastLogin: user.lastLogin }, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('totalInvestments').populate('totalEarnings');
    res.json({ success: true, data: { user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, country: user.country, timezone: user.timezone, avatar: user.avatar, referralCode: user.referralCode, isVerified: user.isVerified, role: user.role, wallet: user.wallet, security: { twoFactorEnabled: user.security.twoFactorEnabled, lastPasswordChange: user.security.lastPasswordChange }, preferences: user.preferences, lastLogin: user.lastLogin, totalInvestments: user.totalInvestments, totalEarnings: user.totalEarnings } } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Error during logout' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    res.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error processing password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    user.security.lastPasswordChange = new Date();
    await user.save();
    await Notification.createNotification(user._id, 'security', 'Password Changed 🔐', 'Your password has been successfully changed.', { icon: '🔐', isImportant: true });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
}; 