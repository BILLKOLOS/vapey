import React from 'react';

const Leaderboard = () => {
  const leaderboardData = [
    {
      id: 1,
      username: 'CryptoKing_2024',
      totalInvestment: 45230,
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      username: 'VapeY_Sarah',
      totalInvestment: 38940,
      joinDate: '2024-03-10'
    },
    {
      id: 3,
      username: 'TradeMaster',
      totalInvestment: 31775,
      joinDate: '2024-02-20'
    }
  ];

  const userRank = 47;

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'default';
    }
  };

  const getTimeText = (joinDate) => {
    const date = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card leaderboard">
      <h2>🏆 Top Investors This Month</h2>
      
      <div className="leaderboard-list">
        {leaderboardData.slice(0, 10).map((investor, index) => (
          <div key={investor.id} className="leader-item">
            <div className="leader-info">
              <div className={`rank-badge ${getRankBadgeColor(index + 1)}`}>
                {index + 1}
              </div>
              <div className="investor-details">
                <div className="investor-name">{investor.username}</div>
                <div className="investor-join-date">
                  Active since {getTimeText(investor.joinDate)}
                </div>
              </div>
            </div>
            <div className="investor-amount">
              {formatCurrency(investor.totalInvestment)}
            </div>
          </div>
        ))}
      </div>
      
      {userRank && (
        <div className="user-rank-info">
          <strong>Your Rank: #{userRank}</strong> • Keep investing to climb higher!
        </div>
      )}
      
      <div className="leaderboard-stats">
        <div className="stat-item">
          <div className="stat-value">{leaderboardData.length}</div>
          <div className="stat-label">Total Participants</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {formatCurrency(leaderboardData[0]?.totalInvestment || 0)}
          </div>
          <div className="stat-label">Top Investor</div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 