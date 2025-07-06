const Investment = require('../models/Investment');
const InvestmentPlan = require('../models/InvestmentPlan');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getPlans = async (req, res) => {
  try {
    const plans = await InvestmentPlan.getActivePlans();
    res.json({ success: true, data: { plans } });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investment plans' });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Investment plan not found' });
    }
    res.json({ success: true, data: { plan } });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investment plan' });
  }
};

exports.createInvestment = async (req, res) => {
  try {
    const { planId, amount, notes } = req.body;
    const plan = await InvestmentPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Investment plan not found' });
    }
    if (!plan.isActive) {
      return res.status(400).json({ success: false, message: 'This investment plan is not available' });
    }
    if (!plan.isAmountValid(amount)) {
      return res.status(400).json({ success: false, message: `Amount must be between $${plan.minAmount} and $${plan.maxAmount}` });
    }
    const user = await User.findById(req.user._id);
    if (user.wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }
    const investment = new Investment({ userId: req.user._id, planId, amount, duration: plan.duration, roi: plan.roi, notes });
    await investment.save();
    user.wallet.balance -= amount;
    await user.save();
    const transaction = new Transaction({ userId: req.user._id, investmentId: investment._id, type: 'investment', amount: -amount, netAmount: -amount, description: `Investment in ${plan.name}`, status: 'completed' });
    await transaction.save();
    
    // Calculate and distribute referral bonuses (3-level system)
    await calculateReferralBonuses(req.user._id, amount);
    
    await Notification.createNotification(req.user._id, 'investment', 'Investment Created 🚀', `Your investment of $${amount} in ${plan.name} has been created successfully.`, { icon: '🚀', actionUrl: `/investments/${investment._id}`, actionText: 'View Investment' });
    res.status(201).json({ success: true, message: 'Investment created successfully', data: { investment: { id: investment._id, amount: investment.amount, duration: investment.duration, roi: investment.roi, status: investment.status, startDate: investment.startDate, endDate: investment.endDate, plan: { id: plan._id, name: plan.name, description: plan.description } } } });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ success: false, message: 'Error creating investment' });
  }
};

// Helper function to calculate and distribute referral bonuses
const calculateReferralBonuses = async (userId, investmentAmount) => {
  try {
    const user = await User.findById(userId);
    if (!user.referredBy) return; // No referrer, no bonuses

    // Level 1: Direct referrer (7%)
    const level1Referrer = await User.findById(user.referredBy);
    if (level1Referrer) {
      const level1Bonus = investmentAmount * 0.07; // 7%
      const level1Transaction = new Transaction({
        userId: level1Referrer._id,
        type: 'referral_bonus',
        amount: level1Bonus,
        netAmount: level1Bonus,
        description: `Level 1 referral bonus from ${user.firstName} ${user.lastName}`,
        status: 'pending',
        metadata: { level: 1, referredUserId: userId, investmentAmount }
      });
      await level1Transaction.save();

      // Check for Level 2 referrer (3%)
      if (level1Referrer.referredBy) {
        const level2Referrer = await User.findById(level1Referrer.referredBy);
        if (level2Referrer) {
          const level2Bonus = investmentAmount * 0.03; // 3%
          const level2Transaction = new Transaction({
            userId: level2Referrer._id,
            type: 'referral_bonus',
            amount: level2Bonus,
            netAmount: level2Bonus,
            description: `Level 2 referral bonus from ${user.firstName} ${user.lastName}`,
            status: 'pending',
            metadata: { level: 2, referredUserId: userId, investmentAmount }
          });
          await level2Transaction.save();

          // Check for Level 3 referrer (1%)
          if (level2Referrer.referredBy) {
            const level3Referrer = await User.findById(level2Referrer.referredBy);
            if (level3Referrer) {
              const level3Bonus = investmentAmount * 0.01; // 1%
              const level3Transaction = new Transaction({
                userId: level3Referrer._id,
                type: 'referral_bonus',
                amount: level3Bonus,
                netAmount: level3Bonus,
                description: `Level 3 referral bonus from ${user.firstName} ${user.lastName}`,
                status: 'pending',
                metadata: { level: 3, referredUserId: userId, investmentAmount }
              });
              await level3Transaction.save();

              // Send notification to Level 3 referrer
              await Notification.createNotification(
                level3Referrer._id,
                'referral',
                'Level 3 Referral Bonus Earned! 🎉',
                `You earned $${level3Bonus} from a Level 3 referral investment.`,
                { icon: '🎉', actionUrl: '/referrals/earnings', actionText: 'View Earnings' }
              );
            }
          }

          // Send notification to Level 2 referrer
          await Notification.createNotification(
            level2Referrer._id,
            'referral',
            'Level 2 Referral Bonus Earned! 🎉',
            `You earned $${level2Bonus} from a Level 2 referral investment.`,
            { icon: '🎉', actionUrl: '/referrals/earnings', actionText: 'View Earnings' }
          );
        }
      }

      // Send notification to Level 1 referrer
      await Notification.createNotification(
        level1Referrer._id,
        'referral',
        'Level 1 Referral Bonus Earned! 🎉',
        `You earned $${level1Bonus} from a direct referral investment.`,
        { icon: '🎉', actionUrl: '/referrals/earnings', actionText: 'View Earnings' }
      );
    }
  } catch (error) {
    console.error('Error calculating referral bonuses:', error);
  }
};

exports.getInvestments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    const investments = await Investment.find(query).populate('planId', 'name description icon color').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalInvestments = await Investment.countDocuments(query);
    const stats = await Investment.getInvestmentStats(req.user._id);
    res.json({ success: true, data: { investments, stats: stats[0] || { totalInvested: 0, totalProfit: 0, activeInvestments: 0, completedInvestments: 0, averageROI: 0 }, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalInvestments, pages: Math.ceil(totalInvestments / limit) } } });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investments' });
  }
};

exports.getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id }).populate('planId');
    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }
    res.json({ success: true, data: { investment } });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investment' });
  }
};

exports.withdrawProfit = async (req, res) => {
  try {
    const { amount } = req.body;
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }
    if (investment.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Can only withdraw from active investments' });
    }
    if (amount > investment.totalProfit) {
      return res.status(400).json({ success: false, message: 'Insufficient profit to withdraw' });
    }
    await investment.withdrawProfit(amount);
    const user = await User.findById(req.user._id);
    user.wallet.balance += amount;
    await user.save();
    const transaction = new Transaction({ userId: req.user._id, investmentId: investment._id, type: 'withdrawal', amount: amount, netAmount: amount, description: `Profit withdrawal from investment`, status: 'completed' });
    await transaction.save();
    await Notification.createNotification(req.user._id, 'withdrawal', 'Profit Withdrawn 💸', `Your profit withdrawal of $${amount} has been processed successfully.`, { icon: '💸', actionUrl: `/transactions/${transaction._id}`, actionText: 'View Transaction' });
    res.json({ success: true, message: 'Profit withdrawn successfully', data: { amount, newBalance: user.wallet.balance, remainingProfit: investment.totalProfit } });
  } catch (error) {
    console.error('Withdraw profit error:', error);
    res.status(500).json({ success: false, message: 'Error withdrawing profit' });
  }
};

exports.getDailyProfits = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const dailyProfits = await Investment.getDailyProfits(req.user._id, parseInt(days));
    res.json({ success: true, data: { dailyProfits: dailyProfits[0] || { totalDailyProfit: 0 } } });
  } catch (error) {
    console.error('Get daily profits error:', error);
    res.status(500).json({ success: false, message: 'Error fetching daily profits' });
  }
};

exports.getInvestmentStats = async (req, res) => {
  try {
    const stats = await Investment.getInvestmentStats(req.user._id);
    const userStats = stats[0] || {
      totalInvested: 0,
      totalProfit: 0,
      activeInvestments: 0,
      completedInvestments: 0,
      averageROI: 0
    };
    
    // Calculate additional stats
    const activeInvestments = await Investment.find({ 
      userId: req.user._id, 
      status: 'active' 
    });
    
    const totalEarned = userStats.totalProfit || 0;
    const dailyEarnings = activeInvestments.reduce((total, inv) => {
      return total + (inv.amount * (inv.roi / 100) / inv.duration);
    }, 0);
    
    const daysRemaining = activeInvestments.reduce((total, inv) => {
      const endDate = new Date(inv.endDate);
      const now = new Date();
      const remaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return total + Math.max(remaining, 0);
    }, 0);
    
    res.json({
      totalInvested: userStats.totalInvested || 0,
      totalEarned,
      dailyEarnings,
      daysRemaining
    });
  } catch (error) {
    console.error('Get investment stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investment stats' });
  }
};

exports.getAllInvestments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    const investments = await Investment.find(query).populate('userId', 'firstName lastName email').populate('planId', 'name').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalInvestments = await Investment.countDocuments(query);
    res.json({ success: true, data: { investments, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalInvestments, pages: Math.ceil(totalInvestments / limit) } } });
  } catch (error) {
    console.error('Get all investments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching investments' });
  }
};

exports.updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const investment = await Investment.findById(id).populate('userId', 'firstName lastName email');
    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }
    const oldStatus = investment.status;
    investment.status = status;
    if (adminNotes) investment.adminNotes = adminNotes;
    await investment.save();
    await Notification.createNotification(investment.userId._id, 'investment', `Investment ${status.charAt(0).toUpperCase() + status.slice(1)} 📊`, `Your investment of $${investment.amount} has been ${status}.`, { icon: '📊', isImportant: status === 'suspended' || status === 'cancelled', actionUrl: `/investments/${investment._id}`, actionText: 'View Investment' });
    res.json({ success: true, message: `Investment status updated to ${status}`, data: { investment: { id: investment._id, status: investment.status, userId: investment.userId, amount: investment.amount } } });
  } catch (error) {
    console.error('Update investment status error:', error);
    res.status(500).json({ success: false, message: 'Error updating investment status' });
  }
}; 