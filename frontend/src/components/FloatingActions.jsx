import React, { useState } from 'react';
import SupportModal from '../Modals/SupportModal';
import NotificationModal from '../Modals/NotificationModal';
import SecurityModal from '../Modals/SecurityModal';

const FloatingActions = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="floating-icons">
        <button 
          className="floating-btn support-btn" 
          onClick={() => openModal('support')} 
          title="24/7 Support"
        >
          💬
        </button>
        <button 
          className="floating-btn notification-btn" 
          onClick={() => openModal('notification')} 
          title="Notifications"
        >
          🔔
          <div className="notification-badge">3</div>
        </button>
        <button 
          className="floating-btn security-btn" 
          onClick={() => openModal('security')} 
          title="Security Center"
        >
          🛡️
        </button>
      </div>

      {activeModal === 'support' && (
        <SupportModal onClose={closeModal} />
      )}
      {activeModal === 'notification' && (
        <NotificationModal onClose={closeModal} />
      )}
      {activeModal === 'security' && (
        <SecurityModal onClose={closeModal} />
      )}
    </>
  );
};

export default FloatingActions; 