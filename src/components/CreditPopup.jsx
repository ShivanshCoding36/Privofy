import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CreditPopup.css';

const CreditPopup = ({ onClose, currentCredits }) => {
  return (
    <motion.div 
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="credit-popup"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="popup-header">
          <h2>Insufficient Credits</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="credit-icon">
            <i className="fas fa-coins"></i>
          </div>
          
          <p>
            You need <span className="highlight">5 credits</span> to generate AI insights, 
            but you only have <span className="highlight">{currentCredits} credits</span>.
          </p>
          
          <p>Purchase more credits to continue using this feature.</p>
          
          <div className="popup-buttons">
            <motion.button 
              className="buy-credits-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/pricing">Buy Credits</Link>
            </motion.button>
            
            <motion.button 
              className="cancel-button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreditPopup; 