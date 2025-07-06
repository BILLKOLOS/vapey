const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;
    const transactions = await Transaction.getUserTransactions(req.user._id, { page: parseInt(page), limit: parseInt(limit), type, status, startDate, endDate });
    const totalTransactions = await Transaction.countDocuments({ userId: req.user._id });
    const stats = await Transaction.getTransactionStats(req.user._id);
    res.json({ success: true, data: { transactions, stats, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalTransactions, pages: Math.ceil(totalTransactions / limit) } } });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id }).populate('investmentId', 'amount roi duration');
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: { transaction } });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ success: false, message: 'Error fetching transaction' });
  }
};

exports.createDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    const transaction = new Transaction({ userId: req.user._id, type: 'deposit', amount: amount, netAmount: amount, description: `Deposit via ${paymentMethod}`, paymentMethod, paymentDetails, status: 'pending' });
    await transaction.save();
    await Notification.createNotification(req.user._id, 'investment', 'Deposit Request 💰', `Your deposit request of $${amount} has been submitted and is being processed.`, { icon: '💰', actionUrl: `/transactions/${transaction._id}`, actionText: 'View Transaction' });
    res.status(201).json({ success: true, message: 'Deposit request created successfully', data: { transaction: { id: transaction._id, amount: transaction.amount, status: transaction.status, reference: transaction.reference } } });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ success: false, message: 'Error creating deposit request' });
  }
};

exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    // Check minimum withdrawal amount
    const MIN_WITHDRAWAL = 10;
    if (amount < MIN_WITHDRAWAL) {
      return res.status(400).json({ success: false, message: `Minimum withdrawal amount is $${MIN_WITHDRAWAL}` });
    }
    
    // Check daily withdrawal limit (2 withdrawals per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayWithdrawals = await Transaction.countDocuments({
      userId: req.user._id,
      type: 'withdrawal',
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    if (todayWithdrawals >= 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Daily withdrawal limit reached. You can only withdraw twice per day.' 
      });
    }
    
    const user = await User.findById(req.user._id);
    if (user.wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }
    
    const fees = amount * 0.02;
    const netAmount = amount - fees;
    const transaction = new Transaction({ 
      userId: req.user._id, 
      type: 'withdrawal', 
      amount: amount, 
      fees: fees, 
      netAmount: netAmount, 
      description: `Withdrawal via ${paymentMethod}`, 
      paymentMethod, 
      paymentDetails, 
      status: 'pending' 
    });
    await transaction.save();
    user.wallet.balance -= amount;
    await user.save();
    await Notification.createNotification(req.user._id, 'withdrawal', 'Withdrawal Request 💸', `Your withdrawal request of $${amount} has been submitted and is being processed.`, { icon: '💸', actionUrl: `/transactions/${transaction._id}`, actionText: 'View Transaction' });
    res.status(201).json({ 
      success: true, 
      message: 'Withdrawal request created successfully', 
      data: { 
        transaction: { 
          id: transaction._id, 
          amount: transaction.amount, 
          fees: transaction.fees, 
          netAmount: transaction.netAmount, 
          status: transaction.status, 
          reference: transaction.reference 
        }, 
        newBalance: user.wallet.balance,
        withdrawalsRemaining: 2 - (todayWithdrawals + 1)
      } 
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Error creating withdrawal request' });
  }
};

exports.getBalanceHistory = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const balanceHistory = await Transaction.getBalanceHistory(req.user._id, parseInt(days));
    res.json({ success: true, data: { balanceHistory } });
  } catch (error) {
    console.error('Get balance history error:', error);
    res.status(500).json({ success: false, message: 'Error fetching balance history' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, userId } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (userId) query.userId = userId;
    const transactions = await Transaction.find(query).populate('userId', 'firstName lastName email').populate('investmentId', 'amount roi').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const totalTransactions = await Transaction.countDocuments(query);
    res.json({ success: true, data: { transactions, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalTransactions, pages: Math.ceil(totalTransactions / limit) } } });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

exports.getPendingTransactions = async (req, res) => {
  try {
    const pendingTransactions = await Transaction.getPendingTransactions();
    res.json({ success: true, data: { transactions: pendingTransactions } });
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending transactions' });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const transaction = await Transaction.findById(id).populate('userId', 'firstName lastName email');
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    const oldStatus = transaction.status;
    transaction.status = status;
    if (adminNotes) transaction.adminNotes = adminNotes;
    transaction.processedAt = new Date();
    transaction.processedBy = req.user._id;
    await transaction.save();
    if (status === 'completed' && oldStatus === 'pending') {
      const user = await User.findById(transaction.userId._id);
      if (transaction.type === 'deposit') {
        user.wallet.balance += transaction.amount;
      } else if (transaction.type === 'withdrawal' && status === 'failed') {
        user.wallet.balance += transaction.amount;
      }
      await user.save();
    }
    const statusMessages = { completed: 'completed successfully', failed: 'failed', cancelled: 'cancelled' };
    if (statusMessages[status]) {
      await Notification.createNotification(transaction.userId._id, transaction.type, `Transaction ${status.charAt(0).toUpperCase() + status.slice(1)} 📊`, `Your ${transaction.type} of $${transaction.amount} has been ${statusMessages[status]}.`, { icon: '📊', isImportant: status === 'failed', actionUrl: `/transactions/${transaction._id}`, actionText: 'View Transaction' });
    }
    res.json({ success: true, message: `Transaction status updated to ${status}`, data: { transaction: { id: transaction._id, status: transaction.status, userId: transaction.userId, amount: transaction.amount, type: transaction.type } } });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ success: false, message: 'Error updating transaction status' });
  }
}; 