import React, { useState } from 'react';
import { useInvestment } from '../../contexts/InvestmentContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';

const WithdrawalCenter = () => {
  const [roiAmount, setRoiAmount] = useState('');
  const [referralAmount, setReferralAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { withdrawROI, withdrawReferral } = useInvestment();

  const MIN_WITHDRAWAL = 10;
  const MAX_WITHDRAWALS_PER_DAY = 2;

  const handleRoiWithdrawal = async () => {
    setError('');
    setSuccess('');
    
    const amount = parseFloat(roiAmount);
    
    if (amount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }
    
    setLoading(true);
    
    try {
      await withdrawROI(amount);
      setSuccess('ROI withdrawal successful!');
      setRoiAmount('');
    } catch (err) {
      setError(err.message || 'Failed to withdraw ROI');
    } finally {
      setLoading(false);
    }
  };

  const handleReferralWithdrawal = async () => {
    setError('');
    setSuccess('');
    
    const amount = parseFloat(referralAmount);
    
    if (amount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }
    
    setLoading(true);
    
    try {
      await withdrawReferral(amount);
      setSuccess('Referral withdrawal successful!');
      setReferralAmount('');
    } catch (err) {
      setError(err.message || 'Failed to withdraw referral earnings');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">💸 Withdrawal Center</h2>
        <div className="withdrawal-status">
          <span className="status-dot"></span>
          Available
        </div>
      </div>
      
      <div className="withdrawal-info mb-6">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Min Withdrawal:</span>
            <span className="info-value">${MIN_WITHDRAWAL}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Daily Limit:</span>
            <span className="info-value">{MAX_WITHDRAWALS_PER_DAY}x</span>
          </div>
          <div className="info-item">
            <span className="info-label">Network:</span>
            <span className="info-value">USDT TRC20</span>
          </div>
        </div>
      </div>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <div className="withdrawal-section">
        <div className="withdrawal-pool">
          <div className="pool-header">
            <h3 className="pool-title">📈 ROI Pool</h3>
            <div className="pool-icon">💰</div>
          </div>
          <div className="pool-balance">
            <div className="balance-amount">$168.00</div>
            <div className="balance-label">Available for withdrawal</div>
          </div>
          <div className="withdrawal-form">
            <div className="input-group">
              <label className="form-label">Amount (USD)</label>
              <div className="amount-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={roiAmount}
                  onChange={(e) => setRoiAmount(e.target.value)}
                  placeholder={`Min: ${MIN_WITHDRAWAL}`}
                  min={MIN_WITHDRAWAL}
                  step="0.01"
                  className="amount-input"
                />
              </div>
            </div>
            <button 
              onClick={handleRoiWithdrawal}
              disabled={!roiAmount || parseFloat(roiAmount) < MIN_WITHDRAWAL || loading}
              className="withdraw-btn"
            >
              {loading ? (
                <div className="btn-content">
                  <LoadingSpinner size="small" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="btn-content">
                  <span className="btn-icon">💸</span>
                  <span>Withdraw ROI</span>
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="withdrawal-pool">
          <div className="pool-header">
            <h3 className="pool-title">🎯 Referral Pool</h3>
            <div className="pool-icon">👥</div>
          </div>
          <div className="pool-balance">
            <div className="balance-amount">$85.50</div>
            <div className="balance-label">Available for withdrawal</div>
          </div>
          <div className="withdrawal-form">
            <div className="input-group">
              <label className="form-label">Amount (USD)</label>
              <div className="amount-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={referralAmount}
                  onChange={(e) => setReferralAmount(e.target.value)}
                  placeholder={`Min: ${MIN_WITHDRAWAL}`}
                  min={MIN_WITHDRAWAL}
                  step="0.01"
                  className="amount-input"
                />
              </div>
            </div>
            <button 
              onClick={handleReferralWithdrawal}
              disabled={!referralAmount || parseFloat(referralAmount) < MIN_WITHDRAWAL || loading}
              className="withdraw-btn"
            >
              {loading ? (
                <div className="btn-content">
                  <LoadingSpinner size="small" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="btn-content">
                  <span className="btn-icon">💸</span>
                  <span>Withdraw Referral</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="withdrawal-status-info">
        <div className="status-item">
          <span className="status-icon">⚡</span>
          <span className="status-text">Next withdrawal available in 8 hours</span>
        </div>
        <div className="status-item">
          <span className="status-icon">🔒</span>
          <span className="status-text">Secure USDT TRC20 network</span>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalCenter; 