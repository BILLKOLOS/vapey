// components/Dashboard/DashboardStats.jsx
import React from 'react';
import { useInvestment } from '../../hooks/useInvestment';
import { formatCurrency } from '../../utils/formatters';

const DashboardStats = () => {
  const { userStats, loading } = useInvestment();
  
  if (loading) {
    return (
      <div className="card">
        <h2>📊 Your Dashboard</h2>
        <div className="loading-placeholder">Loading stats...</div>
      </div>
    );
  }

  const calculateProgress = () => {
    if (!userStats?.contractDays || !userStats?.daysActive) return 0;
    return (userStats.daysActive / userStats.contractDays) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className="card">
      <h2>📊 Your Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">
            {formatCurrency(userStats?.activeInvestment || 0)}
          </div>
          <div className="stat-label">Active Investment</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {formatCurrency(userStats?.dailyEarnings || 0)}
          </div>
          <div className="stat-label">Daily Earnings (2%)</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {formatCurrency(userStats?.totalEarned || 0)}
          </div>
          <div className="stat-label">Total Earned</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {userStats?.daysRemaining || 0}
          </div>
          <div className="stat-label">Days Remaining</div>
        </div>
      </div>
      
      <div className="contract-progress">
        <h3>Contract Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-info">
          <span>Day {userStats?.daysActive || 0}</span>
          <span>{Math.round(progress)}% Complete</span>
          <span>{userStats?.contractDays || 200} Days</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;