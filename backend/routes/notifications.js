const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeBody } = require('../middleware/validation');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, notificationController.getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', protect, notificationController.getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, notificationController.markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', protect, notificationController.markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, notificationController.deleteNotification);

// @route   DELETE /api/notifications/clear-old
// @desc    Clear old read notifications
// @access  Private
router.delete('/clear-old', [
  protect,
  body('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  handleValidationErrors
], notificationController.clearOldNotifications);

// Admin routes
// @route   POST /api/notifications/admin/broadcast
// @desc    Send broadcast notification to all users (Admin)
// @access  Private/Admin
router.post('/admin/broadcast', [
  protect,
  authorize('admin'),
  sanitizeBody,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('type')
    .optional()
    .isIn(['system', 'investment', 'withdrawal', 'profit', 'referral', 'security', 'achievement'])
    .withMessage('Invalid notification type'),
  body('isImportant')
    .optional()
    .isBoolean()
    .withMessage('isImportant must be a boolean'),
  body('actionUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Action URL must be a valid URL'),
  body('actionText')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Action text cannot exceed 50 characters'),
  handleValidationErrors
], notificationController.broadcastNotification);

// @route   POST /api/notifications/admin/send
// @desc    Send notification to specific user (Admin)
// @access  Private/Admin
router.post('/admin/send', [
  protect,
  authorize('admin'),
  sanitizeBody,
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('type')
    .optional()
    .isIn(['system', 'investment', 'withdrawal', 'profit', 'referral', 'security', 'achievement'])
    .withMessage('Invalid notification type'),
  body('isImportant')
    .optional()
    .isBoolean()
    .withMessage('isImportant must be a boolean'),
  body('actionUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Action URL must be a valid URL'),
  body('actionText')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Action text cannot exceed 50 characters'),
  handleValidationErrors
], notificationController.sendNotification);

// @route   GET /api/notifications/admin/stats
// @desc    Get notification statistics (Admin)
// @access  Private/Admin
router.get('/admin/stats', [protect, authorize('admin')], notificationController.getNotificationStats);

module.exports = router; 