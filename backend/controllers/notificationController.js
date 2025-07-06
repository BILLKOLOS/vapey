const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isRead, isImportant } = req.query;
    const notifications = await Notification.getUserNotifications(req.user._id, { page: parseInt(page), limit: parseInt(limit), type, isRead, isImportant });
    const totalNotifications = await Notification.countDocuments({ userId: req.user._id });
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    res.json({ success: true, data: { notifications, unreadCount, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalNotifications, pages: Math.ceil(totalNotifications / limit) } } });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    res.json({ success: true, data: { unreadCount } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: 'Error fetching unread count' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    await notification.markAsRead();
    res.json({ success: true, message: 'Notification marked as read', data: { notification: { id: notification._id, isRead: notification.isRead } } });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ success: false, message: 'Error marking notification as read' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ success: false, message: 'Error marking notifications as read' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Error deleting notification' });
  }
};

exports.clearOldNotifications = async (req, res) => {
  try {
    const { days = 30 } = req.body;
    const result = await Notification.deleteOldNotifications(req.user._id, days);
    res.json({ success: true, message: `Cleared notifications older than ${days} days`, data: { deletedCount: result.deletedCount } });
  } catch (error) {
    console.error('Clear old notifications error:', error);
    res.status(500).json({ success: false, message: 'Error clearing old notifications' });
  }
};

exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = 'system', isImportant = false, actionUrl, actionText } = req.body;
    const notifications = await Notification.createSystemNotification(title, message, { type, isImportant, actionUrl, actionText });
    res.status(201).json({ success: true, message: 'Broadcast notification sent successfully', data: { notificationsSent: notifications.length } });
  } catch (error) {
    console.error('Send broadcast notification error:', error);
    res.status(500).json({ success: false, message: 'Error sending broadcast notification' });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type = 'system', isImportant = false, actionUrl, actionText } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const notification = await Notification.createNotification(userId, type, title, message, { isImportant, actionUrl, actionText });
    res.status(201).json({ success: true, message: 'Notification sent successfully', data: { notification: { id: notification._id, title: notification.title, message: notification.message, type: notification.type } } });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, message: 'Error sending notification' });
  }
};

exports.getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, unreadCount: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }, importantCount: { $sum: { $cond: [{ $eq: ['$isImportant', true] }, 1, 0] } } } }
    ]);
    const totalNotifications = await Notification.countDocuments();
    const totalUnread = await Notification.countDocuments({ isRead: false });
    res.json({ success: true, data: { stats, total: { notifications: totalNotifications, unread: totalUnread } } });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching notification statistics' });
  }
}; 