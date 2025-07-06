const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['investment', 'withdrawal', 'profit', 'referral', 'system', 'security', 'achievement'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: '📢'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: {
    type: Date
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const sent = new Date(this.sentAt);
  const diffMs = now - sent;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Virtual for notification priority
notificationSchema.virtual('priority').get(function() {
  if (this.isImportant) return 'high';
  if (this.type === 'security') return 'high';
  if (this.type === 'system') return 'medium';
  return 'low';
});

// Indexes for better query performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to set default icon based on type
notificationSchema.pre('save', function(next) {
  if (!this.icon || this.icon === '📢') {
    const icons = {
      investment: '💰',
      withdrawal: '💸',
      profit: '📈',
      referral: '👥',
      system: '🔧',
      security: '🛡️',
      achievement: '🏆'
    };
    this.icon = icons[this.type] || '📢';
  }
  next();
});

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  this.readAt = undefined;
  return this.save();
};

notificationSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Static methods
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const { page = 1, limit = 20, type, isRead, isImportant } = options;
  
  const query = { userId };
  
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead;
  if (isImportant !== undefined) query.isImportant = isImportant;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

notificationSchema.statics.deleteOldNotifications = function(userId, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.deleteMany({
    userId,
    isRead: true,
    createdAt: { $lt: cutoffDate }
  });
};

notificationSchema.statics.createNotification = function(userId, type, title, message, options = {}) {
  const notification = new this({
    userId,
    type,
    title,
    message,
    icon: options.icon,
    isImportant: options.isImportant || false,
    actionUrl: options.actionUrl,
    actionText: options.actionText,
    metadata: options.metadata || {},
    expiresAt: options.expiresAt
  });
  
  return notification.save();
};

// Bulk notification methods
notificationSchema.statics.createBulkNotifications = function(notifications) {
  return this.insertMany(notifications);
};

notificationSchema.statics.createSystemNotification = function(title, message, options = {}) {
  // Get all active users
  const User = require('./User');
  
  return User.find({ isActive: true })
    .then(users => {
      const notifications = users.map(user => ({
        userId: user._id,
        type: 'system',
        title,
        message,
        icon: options.icon || '🔧',
        isImportant: options.isImportant || false,
        actionUrl: options.actionUrl,
        actionText: options.actionText,
        metadata: options.metadata || {},
        expiresAt: options.expiresAt
      }));
      
      return this.insertMany(notifications);
    });
};

module.exports = mongoose.model('Notification', notificationSchema); 