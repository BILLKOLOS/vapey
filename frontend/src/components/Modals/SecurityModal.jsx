import React from 'react';
import useSecurity from '../../hooks/useSecurity';

const SecurityModal = ({ onClose }) => {
  const { securitySettings, loginHistory, securityAlerts } = useSecurity();

  const defaultSecurityFeatures = [
    {
      id: 1,
      name: '2FA Enabled',
      icon: '🔐',
      status: 'Active',
      description: 'Two-factor authentication'
    },
    {
      id: 2,
      name: 'SSL Encryption',
      icon: '🔒',
      status: '256-bit',
      description: 'Secure connection'
    },
    {
      id: 3,
      name: 'Cold Storage',
      icon: '🏦',
      status: '95% Secured',
      description: 'Offline storage'
    },
    {
      id: 4,
      name: 'Anti-DDoS',
      icon: '🛡️',
      status: 'Protected',
      description: 'DDoS protection'
    }
  ];

  const defaultRecentActivity = [
    {
      id: 1,
      action: '✅ Login from Chrome - Nairobi, Kenya',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: '✅ Withdrawal Request - $85.50',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 3,
      action: '✅ Password Changed',
      time: '1 week ago',
      status: 'success'
    },
    {
      id: 4,
      action: '⚠️ Failed Login Attempt - Unknown Location',
      time: '2 weeks ago',
      status: 'warning'
    }
  ];

  // Transform security settings into display format
  const displaySecurityFeatures = [
    {
      id: 1,
      name: '2FA Enabled',
      icon: '🔐',
      status: securitySettings.twoFactorEnabled ? 'Active' : 'Inactive',
      description: 'Two-factor authentication'
    },
    {
      id: 2,
      name: 'SSL Encryption',
      icon: '🔒',
      status: '256-bit',
      description: 'Secure connection'
    },
    {
      id: 3,
      name: 'Cold Storage',
      icon: '🏦',
      status: '95% Secured',
      description: 'Offline storage'
    },
    {
      id: 4,
      name: 'Anti-DDoS',
      icon: '🛡️',
      status: 'Protected',
      description: 'DDoS protection'
    }
  ];

  // Transform login history into display format
  const displayRecentActivity = loginHistory.slice(0, 4).map((login, index) => ({
    id: login.id,
    action: `${login.status === 'success' ? '✅' : '⚠️'} Login from ${login.device} - ${login.location || 'Unknown Location'}`,
    time: new Date(login.timestamp).toLocaleDateString(),
    status: login.status === 'success' ? 'success' : 'warning'
  }));

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>🛡️ Security Center</h2>
        
        <div className="security-features">
          {displaySecurityFeatures.map((feature) => (
            <div key={feature.id} className="security-item">
              <div className="security-icon">{feature.icon}</div>
              <div className="security-name">{feature.name}</div>
              <div className="security-status">{feature.status}</div>
              <div className="security-description">{feature.description}</div>
            </div>
          ))}
        </div>

        <div className="security-activity">
          <h3>Recent Security Activity</h3>
          <div className="activity-list">
            {displayRecentActivity.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.status}`}>
                <div className="activity-action">{activity.action}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="security-tips">
          <h3>🔒 Security Tips</h3>
          <ul className="tips-list">
            <li>Never share your 2FA codes with anyone</li>
            <li>Use a strong, unique password</li>
            <li>Enable login notifications</li>
            <li>Regularly review your account activity</li>
            <li>Keep your device and browser updated</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal; 