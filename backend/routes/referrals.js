const express = require('express');
const { protect } = require('../middleware/auth');
const referralController = require('../controllers/referralController');

const router = express.Router();

// @route   GET /api/referrals
// @desc    Get user referrals
// @access  Private
router.get('/', protect, referralController.getReferrals);

// @route   GET /api/referrals/stats
// @desc    Get user referral statistics
// @access  Private
router.get('/stats', protect, referralController.getReferralStats);

// @route   GET /api/referrals/earnings
// @desc    Get user referral earnings
// @access  Private
router.get('/earnings', protect, referralController.getReferralEarnings);

// @route   GET /api/referrals/network
// @desc    Get user referral network
// @access  Private
router.get('/network', protect, referralController.getReferralNetwork);

// @route   POST /api/referrals/claim-bonus
// @desc    Claim referral bonus
// @access  Private
router.post('/claim-bonus', protect, referralController.claimReferralBonus);

// @route   GET /api/referrals/share-link
// @desc    Get user's referral share link
// @access  Private
router.get('/share-link', protect, referralController.getShareLink);

// @route   GET /api/referrals/leaderboard
// @desc    Get referral leaderboard
// @access  Public
router.get('/leaderboard', referralController.getLeaderboard);

module.exports = router; 