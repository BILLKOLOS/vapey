import React from 'react';
import useNotifications from '../../hooks/useNotifications';

const NotificationModal = ({ onClose }) => {
  const { notifications, markAsRead } = useNotifications();

  const defaultNotifications = [
    {
      id: 1,
      type: 'withdrawal',
      title: '💰 Withdrawal Processed',
      message: 'Your withdrawal of $85.50 has been processed successfully',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'referral',
      title: '🎯 New Referral!',
      message: 'You earned $42.00 from a Level 1 referral',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'roi',
      title: '⚡ ROI Update',
      message: 'Daily ROI of $24.00 has been credited to your account',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'investment',
      title: '🚀 Investment Active',
      message: 'Your investment of $1,200 is now active and earning',
      time: '2 days ago',
      read: true
    }
  ];

  const displayNotifications = notifications || defaultNotifications;

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'success';
      case 'referral':
        return 'info';
      case 'roi':
        return 'warning';
      case 'investment':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };



  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>🔔 Notifications</h2>
        
        <div className="notifications-list">
          {displayNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${getNotificationStyle(notification.type)} ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="notification-header">
                <strong>{notification.title}</strong>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
              <div className="notification-message">
                {notification.message}
              </div>
              <div className="notification-time">
                {notification.time}
              </div>
            </div>
          ))}
        </div>

        {displayNotifications.length === 0 && (
          <div className="empty-notifications">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No notifications yet</div>
            <div className="empty-subtext">You'll see important updates here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal; 