import React, { useState, useEffect } from 'react';

const LiveStats = () => {
  const [stats, setStats] = useState({
    usersOnline: 2847,
    totalInvestedToday: 127340,
    platformUptime: '99.9%'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10) - 5,
        totalInvestedToday: prev.totalInvestedToday + Math.floor(Math.random() * 1000) - 500,
        platformUptime: '99.9%'
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-stats">
      <div>
        🟢 <span className="blink">LIVE</span> • Users Online: {stats.usersOnline.toLocaleString()} • 
        Total Invested Today: ${stats.totalInvestedToday.toLocaleString()} • 
        Uptime: {stats.platformUptime}
      </div>
    </div>
  );
};

export default LiveStats; 