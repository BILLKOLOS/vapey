const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeBody } = require('../middleware/validation');
const investmentController = require('../controllers/investmentController');

const router = express.Router();

// @route   GET /api/investments/plans
// @desc    Get available investment plans
// @access  Public
router.get('/plans', investmentController.getPlans);

// @route   GET /api/investments/plans/:id
// @desc    Get specific investment plan
// @access  Public
router.get('/plans/:id', investmentController.getPlanById);

// @route   POST /api/investments
// @desc    Create new investment
// @access  Private
router.post('/', [
  protect,
  sanitizeBody,
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('amount').isFloat({ min: 10 }).withMessage('Amount must be at least $10'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors
], investmentController.createInvestment);

// @route   GET /api/investments
// @desc    Get user investments
// @access  Private
router.get('/', protect, investmentController.getInvestments);

// @route   GET /api/investments/:id
// @desc    Get specific investment
// @access  Private
router.get('/:id', protect, investmentController.getInvestmentById);

// @route   POST /api/investments/:id/withdraw-profit
// @desc    Withdraw profit from investment
// @access  Private
router.post('/:id/withdraw-profit', [
  protect,
  sanitizeBody,
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than $0'),
  handleValidationErrors
], investmentController.withdrawProfit);

// @route   GET /api/investments/stats/daily-profits
// @desc    Get daily profits for user
// @access  Private
router.get('/stats/daily-profits', protect, investmentController.getDailyProfits);

// @route   GET /api/investments/stats
// @desc    Get investment stats for user
// @access  Private
router.get('/stats', protect, investmentController.getInvestmentStats);

// Admin routes
// @route   GET /api/investments/admin/all
// @desc    Get all investments (Admin)
// @access  Private/Admin
router.get('/admin/all', [protect, authorize('admin')], investmentController.getAllInvestments);

// @route   PUT /api/investments/:id/status
// @desc    Update investment status (Admin)
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('status').isIn(['pending', 'active', 'completed', 'cancelled', 'suspended']).withMessage('Invalid status'),
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters'),
  handleValidationErrors
], investmentController.updateInvestmentStatus);

module.exports = router; 