const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

exports.getReferralStats = async (req, res) => {
  try {
    const stats = await User.getReferralStats(req.user._id);
    const referralEarnings = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'referral_bonus' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' }, totalReferrals: { $sum: 1 } } }
    ]);
    const recentReferrals = await User.find({ referredBy: req.user._id }).select('firstName lastName email isActive createdAt').sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, data: { stats: stats[0] || { totalReferrals: 0, activeReferrals: 0 }, earnings: referralEarnings[0] || { totalEarnings: 0, totalReferrals: 0 }, recentReferrals } });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching referral statistics' });
  }
};

exports.getReferralEarnings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const earnings = await Transaction.find({ userId: req.user._id, type: 'referral_bonus' }).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalEarnings = await Transaction.countDocuments({ userId: req.user._id, type: 'referral_bonus' });
    const totalAmount = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'referral_bonus' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, data: { earnings, totalAmount: totalAmount[0]?.total || 0, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalEarnings, pages: Math.ceil(totalEarnings / limit) } } });
  } catch (error) {
    console.error('Get referral earnings error:', error);
    res.status(500).json({ success: false, message: 'Error fetching referral earnings' });
  }
};

exports.getReferralNetwork = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const directReferrals = await User.find({ referredBy: req.user._id }).select('firstName lastName email isActive createdAt').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalDirectReferrals = await User.countDocuments({ referredBy: req.user._id });
    const indirectReferrals = await User.aggregate([
      { $match: { referredBy: req.user._id } },
      { $lookup: { from: 'users', localField: '_id', foreignField: 'referredBy', as: 'indirectReferrals' } },
      { $unwind: '$indirectReferrals' },
      { $project: { 'indirectReferrals.firstName': 1, 'indirectReferrals.lastName': 1, 'indirectReferrals.email': 1, 'indirectReferrals.isActive': 1, 'indirectReferrals.createdAt': 1 } }
    ]);
    res.json({ success: true, data: { directReferrals, indirectReferrals, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalDirectReferrals, pages: Math.ceil(totalDirectReferrals / limit) } } });
  } catch (error) {
    console.error('Get referral network error:', error);
    res.status(500).json({ success: false, message: 'Error fetching referral network' });
  }
};

exports.claimReferralBonus = async (req, res) => {
  try {
    const pendingBonuses = await Transaction.find({ userId: req.user._id, type: 'referral_bonus', status: 'pending' });
    if (pendingBonuses.length === 0) {
      return res.status(400).json({ success: false, message: 'No pending referral bonuses to claim' });
    }
    const totalBonus = pendingBonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    await Transaction.updateMany({ userId: req.user._id, type: 'referral_bonus', status: 'pending' }, { status: 'completed', processedAt: new Date() });
    const user = await User.findById(req.user._id);
    user.wallet.balance += totalBonus;
    await user.save();
    await Notification.createNotification(req.user._id, 'referral', 'Referral Bonus Claimed 🎉', `You have successfully claimed $${totalBonus} in referral bonuses!`, { icon: '🎉', actionUrl: '/referrals/earnings', actionText: 'View Earnings' });
    res.json({ success: true, message: 'Referral bonus claimed successfully', data: { amount: totalBonus, newBalance: user.wallet.balance, bonusesClaimed: pendingBonuses.length } });
  } catch (error) {
    console.error('Claim referral bonus error:', error);
    res.status(500).json({ success: false, message: 'Error claiming referral bonus' });
  }
};

exports.getShareLink = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const shareLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`;
    const shareData = {
      link: shareLink,
      code: user.referralCode,
      message: `Join VapeY Investment using my referral code: ${user.referralCode}`,
      socialLinks: {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join VapeY Investment using my referral code: ${user.referralCode} ${shareLink}`)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Join VapeY Investment using my referral code: ${user.referralCode}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join VapeY Investment using my referral code: ${user.referralCode}`)}&url=${encodeURIComponent(shareLink)}`
      }
    };
    res.json({ success: true, data: shareData });
  } catch (error) {
    console.error('Get share link error:', error);
    res.status(500).json({ success: false, message: 'Error generating share link' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await User.aggregate([
      { $lookup: { from: 'users', localField: '_id', foreignField: 'referredBy', as: 'referrals' } },
      { $project: { firstName: 1, lastName: 1, referralCode: 1, totalReferrals: { $size: '$referrals' }, activeReferrals: { $size: { $filter: { input: '$referrals', cond: { $eq: ['$$this.isActive', true] } } } } } },
      { $match: { totalReferrals: { $gt: 0 } } },
      { $sort: { totalReferrals: -1, activeReferrals: -1 } },
      { $limit: parseInt(limit) }
    ]);
    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'referrals',
      select: 'firstName lastName email status createdAt investmentAmount',
      populate: {
        path: 'referrals',
        select: 'firstName lastName email status createdAt investmentAmount'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Format referrals data
    const formattedReferrals = user.referrals.map(referral => ({
      id: referral._id,
      firstName: referral.firstName,
      lastName: referral.lastName,
      email: referral.email,
      status: referral.status,
      level: 1,
      investmentAmount: referral.investmentAmount || 0,
      createdAt: referral.createdAt,
      // Level 2 referrals
      level2Referrals: referral.referrals.map(l2Referral => ({
        id: l2Referral._id,
        firstName: l2Referral.firstName,
        lastName: l2Referral.lastName,
        email: l2Referral.email,
        status: l2Referral.status,
        level: 2,
        investmentAmount: l2Referral.investmentAmount || 0,
        createdAt: l2Referral.createdAt
      }))
    }));

    res.json({
      success: true,
      data: {
        referrals: formattedReferrals
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ success: false, message: 'Error fetching referrals' });
  }
}; 