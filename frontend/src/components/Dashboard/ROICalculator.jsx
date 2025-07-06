import React, { useState, useEffect } from 'react';

const ROICalculator = () => {
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState(200);
  const [result, setResult] = useState(0);

  const DAILY_ROI = 0.02; // 2%
  const MAX_DAYS = 200;

  useEffect(() => {
    calculateROI();
  }, [amount, days]);

  const calculateROI = () => {
    const investmentAmount = parseFloat(amount) || 0;
    const investmentDays = Math.min(parseInt(days) || 0, MAX_DAYS);
    
    if (investmentAmount > 0 && investmentDays > 0) {
      // Calculate total return: Principal + (Principal * Daily ROI * Days)
      const totalReturn = investmentAmount + (investmentAmount * DAILY_ROI * investmentDays);
      setResult(totalReturn);
    } else {
      setResult(0);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getProfit = () => {
    const investmentAmount = parseFloat(amount) || 0;
    return result - investmentAmount;
  };

  const getProfitPercentage = () => {
    const investmentAmount = parseFloat(amount) || 0;
    if (investmentAmount === 0) return 0;
    return ((result - investmentAmount) / investmentAmount) * 100;
  };

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
            min="20"
            max="10000"
            step="0.01"
          />
        </div>
        
        <div className="input-group">
          <label>Days (Max: {MAX_DAYS})</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Math.min(parseInt(e.target.value) || 0, MAX_DAYS))}
            min="1"
            max={MAX_DAYS}
          />
        </div>
      </div>
      
      <div className="calc-result">
        <div className="result-amount">
          {formatCurrency(result)}
        </div>
        <div className="result-label">Total Expected Return</div>
        
        {amount && parseFloat(amount) > 0 && (
          <div className="result-breakdown">
            <div className="breakdown-item">
              <span>Principal:</span>
              <span>{formatCurrency(parseFloat(amount))}</span>
            </div>
            <div className="breakdown-item">
              <span>Profit:</span>
              <span className="profit">{formatCurrency(getProfit())}</span>
            </div>
            <div className="breakdown-item">
              <span>ROI:</span>
              <span className="roi">{getProfitPercentage().toFixed(2)}%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="calculator-info">
        <div className="info-item">
          <strong>Daily ROI:</strong> 2%
        </div>
        <div className="info-item">
          <strong>Contract Period:</strong> 200 days
        </div>
        <div className="info-item">
          <strong>Max Return:</strong> 400% (4x your investment)
        </div>
      </div>
    </div>
  );
};

export default ROICalculator; 