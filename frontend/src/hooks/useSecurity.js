import { useState, useEffect } from 'react';

const useSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    withdrawalConfirmation: true,
    sessionTimeout: 30, // minutes
    lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    failedLoginAttempts: 0,
    lastLogin: new Date(),
    ipAddress: '192.168.1.1',
    deviceInfo: 'Chrome on Windows 10'
  });

  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows 10',
      location: 'New York, US',
      status: 'success'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows 10',
      location: 'New York, US',
      status: 'success'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      ipAddress: '203.45.67.89',
      device: 'Safari on iPhone',
      location: 'Los Angeles, US',
      status: 'success'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      ipAddress: '45.67.89.123',
      device: 'Unknown Device',
      location: 'Unknown Location',
      status: 'failed'
    }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      type: 'failed_login',
      message: 'Failed login attempt from unknown IP address',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      severity: 'high',
      resolved: false
    },
    {
      id: 2,
      type: 'password_change',
      message: 'Password changed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      severity: 'info',
      resolved: true
    }
  ]);

  useEffect(() => {
    // Load security settings from localStorage or API
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      setSecuritySettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  const toggleTwoFactor = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };

  const toggleEmailNotifications = () => {
    setSecuritySettings(prev => ({
      ...prev,
      emailNotifications: !prev.emailNotifications
    }));
  };

  const toggleLoginAlerts = () => {
    setSecuritySettings(prev => ({
      ...prev,
      loginAlerts: !prev.loginAlerts
    }));
  };

  const toggleWithdrawalConfirmation = () => {
    setSecuritySettings(prev => ({
      ...prev,
      withdrawalConfirmation: !prev.withdrawalConfirmation
    }));
  };

  const updateSessionTimeout = (minutes) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionTimeout: minutes
    }));
  };

  const changePassword = () => {
    setSecuritySettings(prev => ({
      ...prev,
      lastPasswordChange: new Date()
    }));
  };

  const addLoginAttempt = (success, ipAddress, device, location) => {
    const newLogin = {
      id: Date.now(),
      timestamp: new Date(),
      ipAddress,
      device,
      location,
      status: success ? 'success' : 'failed'
    };

    setLoginHistory(prev => [newLogin, ...prev]);

    if (!success) {
      setSecuritySettings(prev => ({
        ...prev,
        failedLoginAttempts: prev.failedLoginAttempts + 1
      }));

      // Add security alert for failed login
      const newAlert = {
        id: Date.now(),
        type: 'failed_login',
        message: `Failed login attempt from ${location || 'unknown location'}`,
        timestamp: new Date(),
        severity: 'high',
        resolved: false
      };

      setSecurityAlerts(prev => [newAlert, ...prev]);
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        failedLoginAttempts: 0,
        lastLogin: new Date(),
        ipAddress,
        deviceInfo: device
      }));
    }
  };

  const resolveSecurityAlert = (alertId) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    );
  };

  const getActiveAlerts = () => {
    return securityAlerts.filter(alert => !alert.resolved);
  };

  const getRecentLogins = (count = 10) => {
    return loginHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, count);
  };

  const getSuspiciousActivity = () => {
    return loginHistory.filter(login => 
      login.status === 'failed' || 
      login.location === 'Unknown Location' ||
      login.device === 'Unknown Device'
    );
  };

  const generateBackupCodes = () => {
    // Generate 10 backup codes for 2FA
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  };

  const validateSecurityScore = () => {
    let score = 0;
    
    if (securitySettings.twoFactorEnabled) score += 30;
    if (securitySettings.emailNotifications) score += 15;
    if (securitySettings.loginAlerts) score += 15;
    if (securitySettings.withdrawalConfirmation) score += 10;
    if (securitySettings.sessionTimeout <= 30) score += 10;
    
    // Check password age
    const daysSincePasswordChange = Math.floor(
      (Date.now() - new Date(securitySettings.lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePasswordChange <= 30) score += 20;
    
    return Math.min(score, 100);
  };

  return {
    securitySettings,
    loginHistory,
    securityAlerts,
    toggleTwoFactor,
    toggleEmailNotifications,
    toggleLoginAlerts,
    toggleWithdrawalConfirmation,
    updateSessionTimeout,
    changePassword,
    addLoginAttempt,
    resolveSecurityAlert,
    getActiveAlerts,
    getRecentLogins,
    getSuspiciousActivity,
    generateBackupCodes,
    validateSecurityScore
  };
};

export default useSecurity; 