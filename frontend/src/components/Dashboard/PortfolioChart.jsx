// components/Dashboard/PortfolioChart.jsx
import React, { useEffect, useRef } from 'react';
import { useInvestment } from '../../contexts/InvestmentContext';

const PortfolioChart = () => {
  const { activeInvestment } = useInvestment();
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // Simple animated line chart using CSS animations
      const chart = chartRef.current;
      const line = chart.querySelector('.chart-line');
      
      // Reset animation
      line.style.animation = 'none';
      // Trigger reflow to ensure animation reset
      line.getBoundingClientRect();
      line.style.animation = 'chartGrow 3s ease-in-out infinite';
    }
  }, [activeInvestment]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const growthPercentage = 24.5; // Simulated growth
  const growthAmount = activeInvestment ? activeInvestment.amount * 0.245 : 0;
  const isPositive = growthPercentage >= 0;

  return (
    <div className="portfolio-chart">
      <h2>📈 Portfolio Performance</h2>
      
      <div className="chart-container" ref={chartRef}>
        <div className="chart-line"></div>
        
        <div className="chart-overlay">
          <div className={`growth-indicator ${isPositive ? 'positive' : 'negative'}`}>
            <div className="growth-percentage">
              {isPositive ? '+' : ''}{growthPercentage.toFixed(1)}% Growth
            </div>
            <div className="growth-amount">
              {isPositive ? '+' : ''}{formatCurrency(growthAmount)}
            </div>
            <div className="growth-period">Last 30 days</div>
          </div>
        </div>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-value">
            {formatCurrency(activeInvestment?.amount || 0)}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">24h Change</div>
          <div className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{formatCurrency(activeInvestment ? activeInvestment.amount * 0.02 : 0)}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Active Investments</div>
          <div className="stat-value">
            {activeInvestment ? 1 : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart; 