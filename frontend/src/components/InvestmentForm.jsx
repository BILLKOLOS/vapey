// components/Investment/InvestmentForm.jsx
import React, { useState } from 'react';
import { useInvestment } from '../../hooks/useInvestment';
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

  return (
    <div className="card">
      <h2>💰 Make Investment</h2>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <form onSubmit={handleSubmit} className="investment-form">
        <div className="input-group">
          <label>Investment Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min: $${MIN_INVESTMENT} | Max: $${MAX_INVESTMENT}`}
            min={MIN_INVESTMENT}
            max={MAX_INVESTMENT}
            step="0.01"
            required
          />
        </div>
        
        <div className="payment-info">
          <strong>🔒 Secure Payment via Binance</strong>
          <div className="usdt-badge">USDT TRC20 Network</div>
          <div className="payment-details">
            Automatic processing • 2% daily ROI • 200-day contract
          </div>
        </div>
        
        <button 
          type="submit" 
          className="invest-btn"
          disabled={!isValidAmount || loading}
        >
          {loading ? <LoadingSpinner size="small" /> : '🚀 Invest Now'}
        </button>
      </form>
    </div>
  );
};

export default InvestmentForm;