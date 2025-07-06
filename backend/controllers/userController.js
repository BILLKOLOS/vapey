const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('referredBy', 'firstName lastName email')
      .populate('totalInvestments')
      .populate('totalEarnings');
    res.json({ success: true, data: { user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, country: user.country, timezone: user.timezone, avatar: user.avatar, referralCode: user.referralCode, referredBy: user.referredBy, isVerified: user.isVerified, role: user.role, wallet: user.wallet, security: { twoFactorEnabled: user.security.twoFactorEnabled, lastPasswordChange: user.security.lastPasswordChange, failedLoginAttempts: user.security.failedLoginAttempts, accountLocked: user.security.accountLocked }, preferences: user.preferences, lastLogin: user.lastLogin, loginHistory: user.loginHistory.slice(0, 5), totalInvestments: user.totalInvestments, totalEarnings: user.totalEarnings } } });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, country, timezone } = req.body;
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (timezone) user.timezone = timezone;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: { user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, country: user.country, timezone: user.timezone, avatar: user.avatar } } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, language, theme } = req.body;
    const user = await User.findById(req.user._id);
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) user.preferences.pushNotifications = pushNotifications;
    if (language) user.preferences.language = language;
    if (theme) user.preferences.theme = theme;
    await user.save();
    res.json({ success: true, message: 'Preferences updated successfully', data: { preferences: user.preferences } });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ success: false, message: 'Error updating preferences' });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const referrals = await User.find({ referredBy: req.user._id })
      .select('firstName lastName email isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const totalReferrals = await User.countDocuments({ referredBy: req.user._id });
    const stats = await User.getReferralStats(req.user._id);
    res.json({ success: true, data: { referrals, stats: stats[0] || { totalReferrals: 0, activeReferrals: 0 }, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalReferrals, pages: Math.ceil(totalReferrals / limit) } } });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ success: false, message: 'Error fetching referrals' });
  }
};

exports.getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { loginHistory: user.loginHistory } });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ success: false, message: 'Error fetching login history' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    res.json({ success: true, message: 'Avatar uploaded successfully', data: { avatar: 'https://example.com/avatar.jpg' } });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ success: false, message: 'Error uploading avatar' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Password is incorrect' });
    }
    const Investment = require('../models/Investment');
    const activeInvestments = await Investment.countDocuments({ userId: req.user._id, status: 'active' });
    if (activeInvestments > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete account with active investments' });
    }
    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Error deleting account' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, role } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.isActive = status === 'active';
    if (role) query.role = role;
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalUsers = await User.countDocuments(query);
    res.json({ success: true, data: { users, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalUsers, pages: Math.ceil(totalUsers / limit) } } });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = isActive;
    await user.save();
    await Notification.createNotification(user._id, 'system', isActive ? 'Account Reactivated ✅' : 'Account Suspended ⚠️', isActive ? 'Your account has been reactivated by an administrator.' : 'Your account has been suspended by an administrator.', { icon: isActive ? '✅' : '⚠️', isImportant: true });
    res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, data: { user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isActive: user.isActive } } });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
}; 