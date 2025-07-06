import React, { useState } from 'react';
import { useInvestment } from '../../contexts/InvestmentContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';

const InvestmentForm = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { createInvestment } = useInvestment();
  
  const MIN_INVESTMENT = 20;
  const MAX_INVESTMENT = 10000;
  const DAILY_ROI = 0.02; // 2%
  const CONTRACT_DAYS = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const investmentAmount = parseFloat(amount);
    
    if (investmentAmount < MIN_INVESTMENT) {
      setError(`Minimum investment is $${MIN_INVESTMENT}`);
      return;
    }
    
    if (investmentAmount > MAX_INVESTMENT) {
      setError(`Maximum investment is $${MAX_INVESTMENT}`);
      return;
    }
    
    setLoading(true);
    
    try {
      await createInvestment({
        amount: investmentAmount,
        dailyROI: DAILY_ROI,
        contractDays: CONTRACT_DAYS
      });
      
      setSuccess('Investment created successfully! You will be redirected to payment.');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  const isValidAmount = amount && parseFloat(amount) >= MIN_INVESTMENT && parseFloat(amount) <= MAX_INVESTMENT;

  const calculateDailyEarnings = (amount) => {
    return (parseFloat(amount) * DAILY_ROI).toFixed(2);
  };

  const calculateTotalEarnings = (amount) => {
    return (parseFloat(amount) * DAILY_ROI * CONTRACT_DAYS).toFixed(2);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">🚀 New Investment</h2>
        <div className="investment-badge">
          <span className="badge-icon">💰</span>
          USDT TRC20
        </div>
      </div>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <form onSubmit={handleSubmit} className="investment-form">
        <div className="input-group">
          <label>Investment Amount (USD)</label>
          <div className="amount-input-container">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`${MIN_INVESTMENT} - ${MAX_INVESTMENT}`}
              min={MIN_INVESTMENT}
              max={MAX_INVESTMENT}
              step="0.01"
              required
              className="amount-input"
            />
          </div>
          <div className="amount-limits">
            <span className="limit-text">Min: ${MIN_INVESTMENT}</span>
            <span className="limit-text">Max: ${MAX_INVESTMENT}</span>
          </div>
        </div>
        
        {/* Investment Preview */}
        {amount && parseFloat(amount) >= MIN_INVESTMENT && (
          <div className="investment-preview">
            <h3 className="preview-title">Investment Preview</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <div className="preview-label">Daily Earnings</div>
                <div className="preview-value text-green-400">
                  ${calculateDailyEarnings(amount)}
                </div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Total Return (200 days)</div>
                <div className="preview-value text-blue-400">
                  ${calculateTotalEarnings(amount)}
                </div>
              </div>
              <div className="preview-item">
                <div className="preview-label">ROI Rate</div>
                <div className="preview-value text-purple-400">2.00%</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Contract Period</div>
                <div className="preview-value text-yellow-400">200 Days</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="payment-info">
          <div className="payment-header">
            <strong className="text-white">🔒 Secure Payment via Binance</strong>
          </div>
          <div className="payment-details">
            <div className="payment-badge">
              <span className="badge-icon">💎</span>
              USDT TRC20 Network
            </div>
            <div className="payment-features">
              <span className="feature-item">✓ Automatic Processing</span>
              <span className="feature-item">✓ Instant Confirmation</span>
              <span className="feature-item">✓ Zero Transaction Fees</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="invest-btn"
          disabled={!isValidAmount || loading}
        >
          {loading ? (
            <div className="btn-content">
              <LoadingSpinner size="small" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="btn-content">
              <span className="btn-icon">🚀</span>
              <span>Invest Now</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default InvestmentForm; 