import React, { useState, useEffect } from 'react';

const Alert = ({ type = 'info', message, autoClose = false, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }[type];

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }[type];

  return (
    <div className={`alert ${alertClasses}`}>
      <div className="alert-content">
        <span className="alert-icon">{icons}</span>
        <span className="alert-message">{message}</span>
      </div>
      <button className="alert-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Alert; 