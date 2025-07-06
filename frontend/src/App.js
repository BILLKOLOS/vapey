import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InvestmentProvider } from './contexts/InvestmentContext';
import { ReferralProvider } from './contexts/ReferralContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Referrals from './pages/Referrals';
import Support from './pages/Support';

// Components
import LoadingSpinner from './components/UI/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  console.log('AppRoutes - user:', user, 'loading:', loading);

  if (loading) {
    console.log('AppRoutes - showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  console.log('AppRoutes - rendering routes, user authenticated:', !!user);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/referrals" 
        element={
          <PrivateRoute>
            <Referrals />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/support" 
        element={
          <PrivateRoute>
            <Support />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <InvestmentProvider>
        <ReferralProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </ReferralProvider>
      </InvestmentProvider>
    </AuthProvider>
  );
};

export default App; 