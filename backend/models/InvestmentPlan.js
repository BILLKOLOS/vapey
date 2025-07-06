const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Plan description is required'],
    trim: true
  },
  minAmount: {
    type: Number,
    required: [true, 'Minimum investment amount is required'],
    min: [1, 'Minimum amount must be at least $1']
  },
  maxAmount: {
    type: Number,
    required: [true, 'Maximum investment amount is required'],
    min: [1, 'Maximum amount must be at least $1']
  },
  duration: {
    type: Number, // in days
    required: [true, 'Investment duration is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  roi: {
    type: Number, // percentage
    required: [true, 'ROI percentage is required'],
    min: [0.1, 'ROI must be at least 0.1%'],
    max: [100, 'ROI cannot exceed 100%']
  },
  dailyPayout: {
    type: Boolean,
    default: true
  },
  weeklyPayout: {
    type: Boolean,
    default: false
  },
  monthlyPayout: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '💰'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  terms: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total return percentage
investmentPlanSchema.virtual('totalReturn').get(function() {
  return (this.roi * this.duration) / 100;
});

// Virtual for daily ROI
investmentPlanSchema.virtual('dailyROI').get(function() {
  return this.roi / this.duration;
});

// Indexes for better query performance
investmentPlanSchema.index({ isActive: 1, sortOrder: 1 });
investmentPlanSchema.index({ minAmount: 1, maxAmount: 1 });
investmentPlanSchema.index({ roi: 1 });

// Instance methods
investmentPlanSchema.methods.calculateProfit = function(amount, days) {
  const dailyProfit = (amount * this.roi) / (100 * this.duration);
  return dailyProfit * Math.min(days, this.duration);
};

investmentPlanSchema.methods.isAmountValid = function(amount) {
  return amount >= this.minAmount && amount <= this.maxAmount;
};

investmentPlanSchema.methods.getPayoutFrequency = function() {
  if (this.dailyPayout) return 'daily';
  if (this.weeklyPayout) return 'weekly';
  if (this.monthlyPayout) return 'monthly';
  return 'at_maturity';
};

// Static methods
investmentPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, minAmount: 1 });
};

investmentPlanSchema.statics.getPopularPlans = function() {
  return this.find({ isActive: true, isPopular: true })
    .sort({ sortOrder: 1 });
};

investmentPlanSchema.statics.getPlanByAmount = function(amount) {
  return this.find({
    isActive: true,
    minAmount: { $lte: amount },
    maxAmount: { $gte: amount }
  }).sort({ roi: -1 });
};

investmentPlanSchema.statics.getStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalPlans: { $sum: 1 },
        averageROI: { $avg: '$roi' },
        averageDuration: { $avg: '$duration' },
        minInvestment: { $min: '$minAmount' },
        maxInvestment: { $max: '$maxAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema); 