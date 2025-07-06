// components/Withdrawal/WithdrawalCenter.jsx
import React, { useState } from 'react';
import { useWithdrawal } from '../../hooks/useWithdrawal';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';

const WithdrawalCenter = () => {
  const { 
    withdrawalData, 
    withdrawROI, 
    withdrawReferral, 
    loading, 
    nextWithdrawalTime 
  } = useWithdrawal();
  
  const [withdrawing, setWithdrawing] = useState({ roi: false, referral: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const MIN_WITHDRAWAL = 10;

  const handleWithdraw = async (type) => {
    setError('');
    setSuccess('');
    
    const amount = type === 'roi' ? withdrawalData?.roiPool : withdrawalData?.referralPool;
    
    if (amount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }
    
    setWithdrawing(prev => ({ ...prev, [type]: true }));
    
    try {
      const withdrawFn = type === 'roi' ? withdrawROI : withdrawReferral;
      await withdrawFn(amount);
      setSuccess(`Withdrawal of ${formatCurrency(amount)} initiated successfully!`);
    } catch (err) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(prev => ({ ...prev, [type]: false }));
    }
  };

  const isWithdrawalAvailable = () => {
    if (!nextWithdrawalTime) return true;
    return new Date() >= new Date(nextWithdrawalTime);
  };

  const getTimeUntilNextWithdrawal = () => {
    if (!nextWithdrawalTime) return null;
    
    const now = new Date();
    const nextTime = new Date(nextWithdrawalTime);
    const diff = nextTime - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const canWithdraw = isWithdrawalAvailable();
  const timeRemaining = getTimeUntilNextWithdrawal();

  return (
    <div className="card">
      <h2>💸 Withdrawal Center</h2>
      <p className="withdrawal-description">
        Withdraw twice daily • Minimum ${MIN_WITHDRAWAL} • USDT TRC20
      </p>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <div className="withdrawal-section">
        <div className="withdrawal-pool">
          <h3>ROI Pool</h3>
          <div className="pool-balance roi-pool">
            <div className="balance-amount">
              {formatCurrency(withdrawalData?.roiPool || 0)}
            </div>
            <div className="balance-label">Available for withdrawal</div>
          </div>
          <button 
            className="withdraw-btn"
            onClick={() => handleWithdraw('roi')}
            disabled={
              !canWithdraw || 
              withdrawing.roi || 
              (withdrawalData?.roiPool || 0) < MIN_WITHDRAWAL
            }
          >
            {withdrawing.roi ? <LoadingSpinner size="small" /> : 'Withdraw ROI'}
          </button>
        </div>
        
        <div className="withdrawal-pool">
          <h3>Referral Pool</h3>
          <div className="pool-balance referral-pool">
            <div className="balance-amount">
              {formatCurrency(withdrawalData?.referralPool || 0)}
            </div>
            <div className="balance-label">Available for withdrawal</div>
          </div>
          <button 
            className="withdraw-btn"
            onClick={() => handleWithdraw('referral')}
            disabled={
              !canWithdraw || 
              withdrawing.referral || 
              (withdrawalData?.referralPool || 0) < MIN_WITHDRAWAL
            }
          >
            {withdrawing.referral ? <LoadingSpinner size="small" /> : 'Withdraw Referral'}
          </button>
        </div>
      </div>
      
      {timeRemaining && (
        <div className="withdrawal-status">
          <strong>⚡ Withdrawal Status:</strong> Next withdrawal available in {timeRemaining}
        </div>
      )}
      
      {canWithdraw && (
        <div className="withdrawal-status available">
          <strong>✅ Withdrawal Available:</strong> You can withdraw now
        </div>
      )}
    </div>
  );
};

export default WithdrawalCenter;