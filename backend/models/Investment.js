const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentPlan',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [10, 'Minimum investment amount is $10']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'suspended'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in days
    required: true
  },
  roi: {
    type: Number, // percentage
    required: true
  },
  totalReturn: {
    type: Number,
    default: 0
  },
  dailyProfit: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  profitHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  }],
  withdrawalHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  }],
  autoReinvest: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  adminNotes: {
    type: String,
    trim: true,
    select: false
  },
  isReferralInvestment: {
    type: Boolean,
    default: false
  },
  referralBonus: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining days
investmentSchema.virtual('remainingDays').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for progress percentage
investmentSchema.virtual('progressPercentage').get(function() {
  if (this.status !== 'active') return 0;
  const totalDuration = this.duration;
  const elapsed = totalDuration - this.remainingDays;
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
});

// Virtual for current value
investmentSchema.virtual('currentValue').get(function() {
  return this.amount + this.totalProfit;
});

// Indexes for better query performance
investmentSchema.index({ userId: 1, status: 1 });
investmentSchema.index({ status: 1, startDate: 1 });
investmentSchema.index({ endDate: 1, status: 1 });
investmentSchema.index({ 'profitHistory.date': 1 });

// Pre-save middleware to calculate end date
investmentSchema.pre('save', function(next) {
  if (this.isModified('startDate') || this.isModified('duration')) {
    this.endDate = new Date(this.startDate.getTime() + (this.duration * 24 * 60 * 60 * 1000));
  }
  next();
});

// Instance methods
investmentSchema.methods.calculateDailyProfit = function() {
  return (this.amount * this.roi) / (100 * this.duration);
};

investmentSchema.methods.addProfit = function(amount, percentage) {
  this.profitHistory.push({
    date: new Date(),
    amount,
    percentage
  });
  
  this.totalProfit += amount;
  this.dailyProfit = amount;
  this.totalReturn = this.amount + this.totalProfit;
  
  return this.save();
};

investmentSchema.methods.withdrawProfit = function(amount) {
  if (amount > this.totalProfit) {
    throw new Error('Insufficient profit to withdraw');
  }
  
  this.withdrawalHistory.push({
    date: new Date(),
    amount,
    status: 'pending'
  });
  
  this.totalProfit -= amount;
  this.totalReturn = this.amount + this.totalProfit;
  
  return this.save();
};

investmentSchema.methods.completeInvestment = function() {
  this.status = 'completed';
  this.endDate = new Date();
  return this.save();
};

investmentSchema.methods.suspendInvestment = function(reason) {
  this.status = 'suspended';
  this.adminNotes = reason;
  return this.save();
};

// Static methods
investmentSchema.statics.getActiveInvestments = function(userId) {
  return this.find({ 
    userId, 
    status: 'active' 
  }).populate('planId');
};

investmentSchema.statics.getInvestmentStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: '$amount' },
        totalProfit: { $sum: '$totalProfit' },
        activeInvestments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        completedInvestments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        averageROI: { $avg: '$roi' }
      }
    }
  ]);
};

investmentSchema.statics.getDailyProfits = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { 
      $match: { 
        userId: mongoose.Types.ObjectId(userId),
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      } 
    },
    {
      $project: {
        dailyProfit: { $divide: [{ $multiply: ['$amount', '$roi'] }, { $multiply: [100, '$duration'] }] }
      }
    },
    {
      $group: {
        _id: null,
        totalDailyProfit: { $sum: '$dailyProfit' }
      }
    }
  ]);
};

module.exports = mongoose.model('Investment', investmentSchema); 