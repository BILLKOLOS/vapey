import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  const colorClass = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  }[color];

  return (
    <div className={`loading-spinner ${sizeClass} ${colorClass}`}>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default LoadingSpinner; 