import React from 'react';
import { useAchievements } from '../../hooks/useAchievements';

const Achievements = () => {
  const { achievements, loading } = useAchievements();

  if (loading) {
    return (
      <div className="card">
        <h2>🎖️ Your Achievements</h2>
        <div className="loading-placeholder">Loading achievements...</div>
      </div>
    );
  }

  const defaultAchievements = [
    {
      id: 1,
      name: 'First Investment',
      icon: '🚀',
      description: 'Make your first investment',
      unlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Diamond Hands',
      icon: '💎',
      description: 'Hold for 100+ days',
      unlocked: true,
      unlockedAt: '2024-04-20'
    },
    {
      id: 3,
      name: 'Team Builder',
      icon: '👥',
      description: '10+ referrals',
      unlocked: true,
      unlockedAt: '2024-03-10'
    },
    {
      id: 4,
      name: 'High Roller',
      icon: '🎯',
      description: '$5K+ investment',
      unlocked: false,
      required: '$5,000 investment'
    },
    {
      id: 5,
      name: 'Referral Master',
      icon: '🌟',
      description: '50+ referrals',
      unlocked: false,
      required: '50 referrals'
    },
    {
      id: 6,
      name: 'Early Adopter',
      icon: '⚡',
      description: 'Join in first month',
      unlocked: true,
      unlockedAt: '2024-01-05'
    }
  ];

  const displayAchievements = achievements || defaultAchievements;

  return (
    <div className="card">
      <h2>🎖️ Your Achievements</h2>
      <div className="achievements">
        {displayAchievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`achievement-badge ${!achievement.unlocked ? 'locked' : ''}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-name">{achievement.name}</div>
            <div className="achievement-description">{achievement.description}</div>
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="achievement-date">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
            {!achievement.unlocked && achievement.required && (
              <div className="achievement-required">
                Requires: {achievement.required}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="achievements-summary">
        <div className="summary-stat">
          <div className="stat-value">
            {displayAchievements.filter(a => a.unlocked).length}
          </div>
          <div className="stat-label">Unlocked</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value">
            {displayAchievements.length}
          </div>
          <div className="stat-label">Total</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value">
            {Math.round((displayAchievements.filter(a => a.unlocked).length / displayAchievements.length) * 100)}%
          </div>
          <div className="stat-label">Completion</div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 