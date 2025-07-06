// components/Charts/PortfolioChart.jsx
import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency } from '../../utils/formatters';

const PortfolioChart = () => {
  const { portfolioData, loading } = usePortfolio();
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (chartRef.current && portfolioData?.performanceData) {
      // Simple animated line chart using CSS animations
      const chart = chartRef.current;
      const line = chart.querySelector('.chart-line');
      
      // Reset animation
      line.style.animation = 'none';
      line.offsetHeight; // Trigger reflow
      line.style.animation = 'chartGrow 3s ease-in-out infinite';
    }
  }, [portfolioData]);

  if (loading) {
    return (
      <div className="portfolio-chart">
        <h2>📈 Portfolio Performance</h2>
        <div className="loading-placeholder">Loading chart...</div>
      </div>
    );
  }

  const growthPercentage = portfolioData?.growthPercentage || 0;
  const growthAmount = portfolioData?.growthAmount || 0;
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
        
        {/* Simple chart points */}
        <div className="chart-points">
          {portfolioData?.chartPoints?.map((point, index) => (
            <div
              key={index}
              className="chart-point"
              style={{
                left: `${(index / (portfolioData.chartPoints.length - 1)) * 100}%`,
                top: `${100 - (point / Math.max(...portfolioData.chartPoints)) * 80}%`
              }}
              title={formatCurrency(point)}
            />
          ))}
        </div>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-value">
            {formatCurrency(portfolioData?.totalValue || 0)}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">24h Change</div>
          <div className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{formatCurrency(portfolioData?.dailyChange || 0)}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Active Investments</div>
          <div className="stat-value">
            {portfolioData?.activeInvestments || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;