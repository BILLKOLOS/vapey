// components/Tools/ROICalculator.jsx
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatters';

const ROICalculator = () => {
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState(200);
  const [result, setResult] = useState(null);
  
  const DAILY_ROI = 0.02; // 2%
  const MIN_INVESTMENT = 20;
  const MAX_INVESTMENT = 10000;
  const MAX_DAYS = 200;

  useEffect(() => {
    calculateROI();
  }, [amount, days]);

  const calculateROI = () => {
    const investmentAmount = parseFloat(amount);
    const investmentDays = parseInt(days);
    
    if (!investmentAmount || investmentAmount <= 0 || investmentDays <= 0) {
      setResult(null);
      return;
    }
    
    const dailyEarnings = investmentAmount * DAILY_ROI;
    const totalEarnings = dailyEarnings * investmentDays;
    const totalReturn = investmentAmount + totalEarnings;
    
    setResult({
      dailyEarnings,
      totalEarnings,
      totalReturn,
      investmentAmount,
      days: investmentDays
    });
  };

  const isValidAmount = amount && parseFloat(amount) >= MIN_INVESTMENT && parseFloat(amount) <= MAX_INVESTMENT;
  const isValidDays = days >= 1 && days <= MAX_DAYS;

  return (
    <div className="calculator">
      <h2>🧮 ROI Calculator</h2>
      
      <div className="calculator-inputs">
        <div className="input-group">
          <label>Investment Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min={MIN_INVESTMENT}
            max={MAX_INVESTMENT}
            className={!isValidAmount && amount ? 'invalid' : ''}
          />
          {amount && !isValidAmount && (
            <div className="input-error">
              Amount must be between ${MIN_INVESTMENT} and ${MAX_INVESTMENT}
            </div>
          )}
        </div>
        
        <div className="input-group">
          <label>Investment Period (Days)</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Math.min(parseInt(e.target.value) || 0, MAX_DAYS))}
            min="1"
            max={MAX_DAYS}
            className={!isValidDays ? 'invalid' : ''}
          />
          <div className="input-help">
            Maximum contract period: {MAX_DAYS} days
          </div>
        </div>
      </div>
      
      <div className="calculator-info">
        <div className="info-item">
          <span>Daily ROI:</span>
          <span className="highlight">{(DAILY_ROI * 100).toFixed(1)}%</span>
        </div>
        <div className="info-item">
          <span>Compounding:</span>
          <span>No (Simple Interest)</span>
        </div>
      </div>
      
      <div className="calc-result">
        {result ? (
          <div className="result-breakdown">
            <div className="result-header">
              <div className="total-return">
                {formatCurrency(result.totalReturn)}
              </div>
              <div className="result-label">Total Expected Return</div>
            </div>
            
            <div className="result-details">
              <div className="detail-item">
                <span>Initial Investment:</span>
                <span>{formatCurrency(result.investmentAmount)}</span>
              </div>
              <div className="detail-item">
                <span>Daily Earnings:</span>
                <span className="positive">{formatCurrency(result.dailyEarnings)}</span>
              </div>
              <div className="detail-item">
                <span>Total Profit:</span>
                <span className="positive">{formatCurrency(result.totalEarnings)}</span>
              </div>
              <div className="detail-item">
                <span>Investment Period:</span>
                <span>{result.days} days</span>
              </div>
              <div className="detail-item total">
                <span>Total ROI:</span>
                <span className="positive">
                  {((result.totalEarnings / result.investmentAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-result">
            <div className="placeholder-amount">$0.00</div>
            <div className="result-label">Enter amount to calculate</div>
          </div>
        )}
      </div>
      
      <div className="calculator-footer">
        <div className="disclaimer">
          * Calculations are estimates based on current rates. 
          Actual returns may vary based on market conditions.
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;