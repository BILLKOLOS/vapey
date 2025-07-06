import React, { useState } from 'react';
import { useReferral } from '../../contexts/ReferralContext';
import Alert from '../UI/Alert';

const ReferralSystem = () => {
  const { referralStats, referralLink, copyReferralLink } = useReferral();
  const [copied, setCopied] = useState(false);
  
  const referralLevels = [
    { level: 1, percentage: 7, description: 'Direct Referrals' },
    { level: 2, percentage: 3, description: '2nd Level Referrals' },
    { level: 3, percentage: 1, description: '3rd Level Referrals' }
  ];

  const handleCopyReferralLink = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="card referral-section">
      <h2>🎯 Referral Program - Earn More!</h2>
      <p className="referral-description">
        Invite friends and earn from their investments on 3 levels
      </p>
      
      <div className="referral-levels">
        {referralLevels.map(({ level, percentage, description }) => (
          <div key={level} className="level-card">
            <div className="level-percentage">{percentage}%</div>
            <div>Level {level}</div>
            <div className="level-description">{description}</div>
          </div>
        ))}
      </div>
      
      <div className="referral-info">
        <strong>Your Referral Link:</strong>
        <div className="referral-link-container">
          <div className="referral-link">
            {referralLink || 'Loading...'}
          </div>
          <button 
            onClick={handleCopyReferralLink}
            className="copy-btn"
            disabled={!referralLink}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="referral-stats">
          <strong>Referral Earnings:</strong> {formatCurrency(referralStats.totalEarnings || 0)}
          <span className="separator">|</span>
          <strong>Total Referrals:</strong> {referralStats.totalReferrals || 0} Active
        </div>
      </div>
      
      {copied && (
        <Alert 
          type="success" 
          message="Referral link copied to clipboard!" 
          duration={2000}
        />
      )}
    </div>
  );
};

export default ReferralSystem; 