// components/Referral/ReferralSystem.jsx
import React, { useState } from 'react';
import { useReferral } from '../../hooks/useReferral';
import { formatCurrency } from '../../utils/formatters';
import { copyToClipboard } from '../../utils/helpers';
import Alert from '../UI/Alert';

const ReferralSystem = () => {
  const { referralData, loading } = useReferral();
  const [copied, setCopied] = useState(false);
  
  const referralLevels = [
    { level: 1, percentage: 7, description: 'Direct Referrals' },
    { level: 2, percentage: 3, description: '2nd Level Referrals' },
    { level: 3, percentage: 1, description: '3rd Level Referrals' }
  ];

  const handleCopyReferralLink = async () => {
    if (referralData?.referralLink) {
      const success = await copyToClipboard(referralData.referralLink);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="card referral-section">
        <h2>🎯 Referral Program</h2>
        <div className="loading-placeholder">Loading referral data...</div>
      </div>
    );
  }

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
            {referralData?.referralLink || 'Loading...'}
          </div>
          <button 
            onClick={handleCopyReferralLink}
            className="copy-btn"
            disabled={!referralData?.referralLink}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="referral-stats">
          <strong>Referral Earnings:</strong> {formatCurrency(referralData?.totalEarnings || 0)}
          <span className="separator">|</span>
          <strong>Total Referrals:</strong> {referralData?.totalReferrals || 0} Active
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