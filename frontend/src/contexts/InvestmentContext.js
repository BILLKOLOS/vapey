import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const InvestmentContext = createContext();

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

export const InvestmentProvider = ({ children }) => {
  const [investments, setInvestments] = useState([]);
  const [activeInvestment, setActiveInvestment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalEarned: 0,
    dailyEarnings: 0,
    daysRemaining: 0
  });

  const { user } = useAuth();

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      fetchInvestments();
      fetchStats();
    }
  }, [user]); // Add user as dependency

  const fetchInvestments = async () => {
    // Don't fetch if user is not authenticated
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/investments');
      setInvestments(response.data.investments);
      
      // Set active investment (most recent or current)
      const active = response.data.investments.find(inv => inv.status === 'active');
      setActiveInvestment(active || null);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      // Only show error toast if it's not a 401 error (unauthorized)
      if (error.response?.status !== 401) {
        toast.error('Failed to load investments');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Don't fetch if user is not authenticated
    if (!user) return;
    
    try {
      const response = await api.get('/investments/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch investment stats:', error);
      // Only show error toast if it's not a 401 error (unauthorized)
      if (error.response?.status !== 401) {
        toast.error('Failed to load investment stats');
      }
    }
  };

  const createInvestment = async (investmentData) => {
    try {
      setLoading(true);
      const response = await api.post('/investments', investmentData);
      
      // Add new investment to list
      setInvestments(prev => [...prev, response.data.investment]);
      setActiveInvestment(response.data.investment);
      
      toast.success('Investment created successfully!');
      return { success: true, investment: response.data.investment };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create investment';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const withdrawROI = async (amount) => {
    try {
      setLoading(true);
      const response = await api.post('/investments/withdraw-roi', { amount });
      
      // Update stats after withdrawal
      await fetchStats();
      
      toast.success('ROI withdrawal successful!');
      return { success: true, transaction: response.data.transaction };
    } catch (error) {
      const message = error.response?.data?.message || 'Withdrawal failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const withdrawReferral = async (amount) => {
    try {
      setLoading(true);
      const response = await api.post('/investments/withdraw-referral', { amount });
      
      toast.success('Referral withdrawal successful!');
      return { success: true, transaction: response.data.transaction };
    } catch (error) {
      const message = error.response?.data?.message || 'Withdrawal failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentProgress = (investment) => {
    if (!investment) return 0;
    
    const startDate = new Date(investment.startDate);
    const endDate = new Date(investment.endDate);
    const now = new Date();
    
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now - startDate) / (1000 * 60 * 60 * 24);
    
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  const calculateDailyEarnings = (investment) => {
    if (!investment) return 0;
    return investment.amount * 0.02; // 2% daily ROI
  };

  const calculateTotalEarnings = (investment) => {
    if (!investment) return 0;
    
    const startDate = new Date(investment.startDate);
    const now = new Date();
    const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
    return Math.min(daysElapsed * calculateDailyEarnings(investment), investment.amount * 4); // Max 400% return
  };

  const getDaysRemaining = (investment) => {
    if (!investment) return 0;
    
    const endDate = new Date(investment.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    
    return Math.max(daysRemaining, 0);
  };

  const value = {
    investments,
    activeInvestment,
    loading,
    stats,
    createInvestment,
    withdrawROI,
    withdrawReferral,
    fetchInvestments,
    fetchStats,
    getInvestmentProgress,
    calculateDailyEarnings,
    calculateTotalEarnings,
    getDaysRemaining
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
}; 