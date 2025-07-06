const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeBody } = require('../middleware/validation');
const userController = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  protect,
  sanitizeBody,
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  body('timezone')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Timezone must be between 3 and 20 characters'),
  handleValidationErrors
], userController.updateProfile);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  protect,
  sanitizeBody,
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('pushNotifications')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'pt'])
    .withMessage('Invalid language selection'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Invalid theme selection'),
  handleValidationErrors
], userController.updatePreferences);

// @route   GET /api/users/referrals
// @desc    Get user referrals
// @access  Private
router.get('/referrals', protect, userController.getReferrals);

// @route   GET /api/users/login-history
// @desc    Get user login history
// @access  Private
router.get('/login-history', protect, userController.getLoginHistory);

// @route   POST /api/users/upload-avatar
// @desc    Upload user avatar
// @access  Private
router.post('/upload-avatar', protect, userController.uploadAvatar);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  protect,
  body('password')
    .notEmpty()
    .withMessage('Password is required to confirm account deletion'),
  handleValidationErrors
], userController.deleteAccount);

// Admin routes
// @route   GET /api/users (Admin)
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', [protect, authorize('admin')], userController.getAllUsers);

// @route   PUT /api/users/:id/status (Admin)
// @desc    Update user status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
], userController.updateUserStatus);

module.exports = router; 