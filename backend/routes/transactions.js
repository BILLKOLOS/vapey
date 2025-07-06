const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeBody } = require('../middleware/validation');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get user transactions
// @access  Private
router.get('/', protect, transactionController.getTransactions);

// @route   GET /api/transactions/:id
// @desc    Get specific transaction
// @access  Private
router.get('/:id', protect, transactionController.getTransactionById);

// @route   POST /api/transactions/deposit
// @desc    Create deposit transaction
// @access  Private
router.post('/deposit', [
  protect,
  sanitizeBody,
  body('amount').isFloat({ min: 10 }).withMessage('Minimum deposit amount is $10'),
  body('paymentMethod').isIn(['bank_transfer', 'crypto', 'credit_card', 'paypal']).withMessage('Invalid payment method'),
  body('paymentDetails').optional().isObject().withMessage('Payment details must be an object'),
  handleValidationErrors
], transactionController.createDeposit);

// @route   POST /api/transactions/withdrawal
// @desc    Create withdrawal transaction
// @access  Private
router.post('/withdrawal', [
  protect,
  sanitizeBody,
  body('amount').isFloat({ min: 10 }).withMessage('Minimum withdrawal amount is $10'),
  body('paymentMethod').isIn(['bank_transfer', 'crypto', 'paypal']).withMessage('Invalid payment method'),
  body('paymentDetails').isObject().withMessage('Payment details are required'),
  handleValidationErrors
], transactionController.createWithdrawal);

// @route   GET /api/transactions/stats/balance-history
// @desc    Get balance history for user
// @access  Private
router.get('/stats/balance-history', protect, transactionController.getBalanceHistory);

// Admin routes
// @route   GET /api/transactions/admin/all
// @desc    Get all transactions (Admin)
// @access  Private/Admin
router.get('/admin/all', [protect, authorize('admin')], transactionController.getAllTransactions);

// @route   GET /api/transactions/admin/pending
// @desc    Get pending transactions (Admin)
// @access  Private/Admin
router.get('/admin/pending', [protect, authorize('admin')], transactionController.getPendingTransactions);

// @route   PUT /api/transactions/:id/status
// @desc    Update transaction status (Admin)
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('status').isIn(['pending', 'completed', 'failed', 'cancelled']).withMessage('Invalid status'),
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters'),
  handleValidationErrors
], transactionController.updateTransactionStatus);

module.exports = router; 