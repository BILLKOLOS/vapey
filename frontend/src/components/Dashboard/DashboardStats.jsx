import React from 'react';
import { useInvestment } from '../../contexts/InvestmentContext';

const DashboardStats = ({ activeInvestment, stats }) => {
  const { getInvestmentProgress, calculateDailyEarnings, calculateTotalEarnings, getDaysRemaining } = useInvestment();
  
  const progress = getInvestmentProgress(activeInvestment);
  const dailyEarnings = calculateDailyEarnings(activeInvestment);
  const totalEarned = calculateTotalEarnings(activeInvestment);
  const daysRemaining = getDaysRemaining(activeInvestment);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">📊 Portfolio Overview</h2>
        <div className="status-badge active">
          <span className="status-dot"></span>
          Active
        </div>
      </div>
      
      {/* Main Stats Grid */}
      <div className="stats-grid mb-6">
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            {formatCurrency(activeInvestment?.amount || 0)}
          </div>
          <div className="stat-label">Principal Investment</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-value text-green-400">
            {formatCurrency(dailyEarnings)}
          </div>
          <div className="stat-label">Daily Earnings (2%)</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">💎</div>
          <div className="stat-value text-blue-400">
            {formatCurrency(totalEarned)}
          </div>
          <div className="stat-label">Total Profits</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">⏰</div>
          <div className="stat-value text-yellow-400">
            {daysRemaining}
          </div>
          <div className="stat-label">Days Remaining</div>
        </div>
      </div>
      
      {/* Contract Progress */}
      <div className="contract-progress mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Contract Progress</h3>
          <span className="text-sm text-gray-300">{Math.round(progress)}% Complete</span>
        </div>
        
        <div className="progress-bar mb-2">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="progress-info">
          <span className="text-xs text-gray-300">
            Day {activeInvestment ? Math.floor((new Date() - new Date(activeInvestment.startDate)) / (1000 * 60 * 60 * 24)) : 0}
          </span>
          <span className="text-xs text-gray-300">
            {formatPercentage(progress / 100)}
          </span>
          <span className="text-xs text-gray-300">200 Days</span>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="performance-metrics">
        <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">ROI Rate</div>
            <div className="metric-value text-green-400">2.00%</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Total Return</div>
            <div className="metric-value text-blue-400">
              {formatPercentage((totalEarned / (activeInvestment?.amount || 1)) * 100)}
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Contract Value</div>
            <div className="metric-value text-purple-400">
              {formatCurrency((activeInvestment?.amount || 0) + totalEarned)}
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Next Payout</div>
            <div className="metric-value text-yellow-400">In 24h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 