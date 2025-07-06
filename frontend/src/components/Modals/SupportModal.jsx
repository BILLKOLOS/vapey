import React from 'react';

const SupportModal = ({ onClose }) => {
  const tradingSignals = [
    {
      pair: 'BTC/USDT',
      time: '15 minutes ago',
      profit: '+2.4%',
      direction: '↗'
    },
    {
      pair: 'ETH/USDT',
      time: '1 hour ago',
      profit: '+1.8%',
      direction: '↗'
    },
    {
      pair: 'ADA/USDT',
      time: '3 hours ago',
      profit: '-0.5%',
      direction: '↘'
    }
  ];

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>💬 24/7 Customer Support</h2>
        
        <div className="support-options">
          <div className="support-option">
            <strong>🚀 Live Chat</strong>
            <div className="support-details">
              Average response time: 2 minutes
            </div>
            <button className="support-btn primary">Start Live Chat</button>
          </div>
          
          <div className="support-option">
            <strong>📧 Email Support</strong>
            <div className="support-details">
              support@vapeyinvestment.com
            </div>
            <div className="support-details">
              Response within 1 hour
            </div>
          </div>
          
          <div className="support-option">
            <strong>🔍 FAQ & Help Center</strong>
            <div className="support-details">
              Find instant answers to common questions
            </div>
            <button className="support-btn secondary">Browse FAQ</button>
          </div>
        </div>

        <div className="trading-signals">
          <h3>📊 Recent Trading Signals</h3>
          {tradingSignals.map((signal, index) => (
            <div key={index} className="signal-item">
              <div className="signal-header">
                <div className="signal-pair">
                  <strong>{signal.pair}</strong>
                  <div className="signal-time">{signal.time}</div>
                </div>
                <div className={`signal-profit ${signal.profit.startsWith('+') ? 'positive' : 'negative'}`}>
                  {signal.profit} {signal.direction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportModal; 