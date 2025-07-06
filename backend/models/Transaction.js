const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'profit', 'referral_bonus', 'investment', 'refund', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0.01, 'Amount must be at least $0.01']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    trim: true
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'crypto', 'credit_card', 'paypal', 'internal'],
    default: 'internal'
  },
  paymentDetails: {
    walletAddress: String,
    transactionHash: String,
    bankAccount: String,
    cardLast4: String,
    paypalEmail: String
  },
  fees: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  adminNotes: {
    type: String,
    trim: true,
    select: false
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction type icon
transactionSchema.virtual('typeIcon').get(function() {
  const icons = {
    deposit: '💰',
    withdrawal: '💸',
    profit: '📈',
    referral_bonus: '👥',
    investment: '🚀',
    refund: '↩️',
    fee: '💳'
  };
  return icons[this.type] || '📊';
});

// Virtual for status color
transactionSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: 'yellow',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray'
  };
  return colors[this.status] || 'blue';
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ 'paymentDetails.transactionHash': 1 });
transactionSchema.index({ createdAt: 1 });

// Pre-save middleware to generate reference and calculate net amount
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = this.generateReference();
  }
  
  if (this.isModified('amount') || this.isModified('fees')) {
    this.netAmount = this.amount - this.fees;
  }
  
  next();
});

// Instance methods
transactionSchema.methods.generateReference = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 6);
  const type = this.type.substr(0, 3).toUpperCase();
  return `${type}${timestamp}${random}`.toUpperCase();
};

transactionSchema.methods.complete = function(adminId = null) {
  this.status = 'completed';
  this.processedAt = new Date();
  if (adminId) {
    this.processedBy = adminId;
  }
  return this.save();
};

transactionSchema.methods.fail = function(reason, adminId = null) {
  this.status = 'failed';
  this.adminNotes = reason;
  this.processedAt = new Date();
  if (adminId) {
    this.processedBy = adminId;
  }
  return this.save();
};

transactionSchema.methods.cancel = function(reason, adminId = null) {
  this.status = 'cancelled';
  this.adminNotes = reason;
  this.processedAt = new Date();
  if (adminId) {
    this.processedBy = adminId;
  }
  return this.save();
};

// Static methods
transactionSchema.statics.getUserTransactions = function(userId, options = {}) {
  const { page = 1, limit = 20, type, status, startDate, endDate } = options;
  
  const query = { userId };
  
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('investmentId', 'amount roi duration');
};

transactionSchema.statics.getTransactionStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalNetAmount: { $sum: '$netAmount' }
      }
    }
  ]);
};

transactionSchema.statics.getBalanceHistory = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        deposits: {
          $sum: {
            $cond: [{ $eq: ['$type', 'deposit'] }, '$netAmount', 0]
          }
        },
        withdrawals: {
          $sum: {
            $cond: [{ $eq: ['$type', 'withdrawal'] }, '$netAmount', 0]
          }
        },
        profits: {
          $sum: {
            $cond: [{ $eq: ['$type', 'profit'] }, '$netAmount', 0]
          }
        },
        referralBonuses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'referral_bonus'] }, '$netAmount', 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

transactionSchema.statics.getPendingTransactions = function() {
  return this.find({ status: 'pending' })
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: 1 });
};

module.exports = mongoose.model('Transaction', transactionSchema); 