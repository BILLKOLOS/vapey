import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ user }) => {
  const { logout } = useAuth();
  
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="header">
      <div className="logo">VapeY Investment</div>
      <div className="user-info">
        <div className="balance pulse">
          Balance: ${user?.balance?.toFixed(2) || '0.00'}
        </div>
        <div className="user-avatar">
          {getInitials(user?.name || user?.email)}
        </div>
        <div className="user-menu">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header; 