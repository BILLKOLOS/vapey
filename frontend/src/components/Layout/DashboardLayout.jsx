import React from 'react';
import Header from './Header';
import FloatingActions from './FloatingActions';
import LiveStats from './LiveStats';
import NewsTicker from './NewsTicker';

const DashboardLayout = ({ children, user }) => {
  return (
    <div className="dashboard-container">
      <div className="container">
        <NewsTicker />
        <Header user={user} />
        <main className="main-content">
          {children}
        </main>
        <FloatingActions />
        <LiveStats />
      </div>
    </div>
  );
};

export default DashboardLayout; 