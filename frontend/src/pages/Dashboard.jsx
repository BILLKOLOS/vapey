import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInvestment } from '../contexts/InvestmentContext';
import { useReferral } from '../contexts/ReferralContext';
import { useNotification } from '../contexts/NotificationContext';

// Layout Components
import DashboardLayout from '../components/Layout/DashboardLayout';
import Header from '../components/Layout/Header';
import NewsTicker from '../components/Layout/NewsTicker';
import FloatingActions from '../components/Layout/FloatingActions';
import LiveStats from '../components/Layout/LiveStats';

// Main Components
import InvestmentForm from '../components/Investment/InvestmentForm';
import DashboardStats from '../components/Dashboard/DashboardStats';
import PortfolioChart from '../components/Dashboard/PortfolioChart';
import ROICalculator from '../components/Dashboard/ROICalculator';
import ReferralSystem from '../components/Referral/ReferralSystem';
import WithdrawalCenter from '../components/Withdrawal/WithdrawalCenter';
import Leaderboard from '../components/Social/Leaderboard';
import Achievements from '../components/Social/Achievements';

const Dashboard = () => {
  const { user } = useAuth();
  const { activeInvestment, stats } = useInvestment();
  const { referralStats } = useReferral();
  const { unreadCount } = useNotification();

  return (
    <DashboardLayout user={user}>
      <div className="dashboard-container">
        {/* News Ticker */}
        <NewsTicker />
        
        {/* Header */}
        <Header user={user} />
        
        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column - Investment & Stats */}
          <div className="left-column">
            {/* Investment Form */}
            <div className="section-card">
              <InvestmentForm />
            </div>
            
            {/* Portfolio Chart */}
            <div className="section-card">
              <PortfolioChart />
            </div>
            
            {/* ROI Calculator */}
            <div className="section-card">
              <ROICalculator />
            </div>
          </div>
          
          {/* Right Column - Stats & Actions */}
          <div className="right-column">
            {/* Dashboard Stats */}
            <div className="section-card">
              <DashboardStats 
                activeInvestment={activeInvestment}
                stats={stats}
              />
            </div>
            
            {/* Withdrawal Center */}
            <div className="section-card">
              <WithdrawalCenter />
            </div>
            
            {/* Referral System */}
            <div className="section-card">
              <ReferralSystem />
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Social Features */}
        <div className="bottom-section">
          <div className="social-grid">
            <div className="section-card">
              <Leaderboard />
            </div>
            <div className="section-card">
              <Achievements />
            </div>
          </div>
        </div>
        
        {/* Floating Actions */}
        <FloatingActions />
        
        {/* Live Stats */}
        <LiveStats />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 