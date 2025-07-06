import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ReferralContext = createContext();

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider = ({ children }) => {
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Earnings: 0,
    level2Earnings: 0,
    level3Earnings: 0
  });
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      fetchReferrals();
      fetchReferralStats();
      generateReferralLink();
    }
  }, [user]); // Add user as dependency

  const fetchReferrals = async () => {
    // Don't fetch if user is not authenticated
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/referrals');
      setReferrals(response.data.referrals);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
      // Only show error toast if it's not a 401 error (unauthorized)
      if (error.response?.status !== 401) {
        toast.error('Failed to load referrals');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    // Don't fetch if user is not authenticated
    if (!user) return;
    
    try {
      const response = await api.get('/referrals/stats');
      setReferralStats(response.data);
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
      // Only show error toast if it's not a 401 error (unauthorized)
      if (error.response?.status !== 401) {
        toast.error('Failed to load referral stats');
      }
    }
  };

  const generateReferralLink = () => {
    // Don't generate if user is not authenticated
    if (!user) return;
    
    const baseUrl = window.location.origin;
    const userId = user._id || user.id || 'user';
    const link = `${baseUrl}/register?ref=${userId}`;
    setReferralLink(link);
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy referral link');
    }
  };

  const getReferralLevel = (level) => {
    switch (level) {
      case 1:
        return { percentage: 7, color: 'text-green-600' };
      case 2:
        return { percentage: 3, color: 'text-blue-600' };
      case 3:
        return { percentage: 1, color: 'text-purple-600' };
      default:
        return { percentage: 0, color: 'text-gray-600' };
    }
  };

  const getReferralTree = () => {
    const tree = {
      level1: [],
      level2: [],
      level3: []
    };

    referrals.forEach(referral => {
      if (referral.level === 1) {
        tree.level1.push(referral);
      } else if (referral.level === 2) {
        tree.level2.push(referral);
      } else if (referral.level === 3) {
        tree.level3.push(referral);
      }
    });

    return tree;
  };

  const calculateReferralEarnings = (referral) => {
    const level = getReferralLevel(referral.level);
    return (referral.investmentAmount * level.percentage) / 100;
  };

  const getActiveReferrals = () => {
    return referrals.filter(referral => referral.status === 'active');
  };

  const getReferralStatus = (referral) => {
    if (referral.status === 'active') {
      return { text: 'Active', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (referral.status === 'pending') {
      return { text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { text: 'Inactive', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const value = {
    referrals,
    referralStats,
    referralLink,
    loading,
    fetchReferrals,
    fetchReferralStats,
    copyReferralLink,
    getReferralLevel,
    getReferralTree,
    calculateReferralEarnings,
    getActiveReferrals,
    getReferralStatus
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
}; 