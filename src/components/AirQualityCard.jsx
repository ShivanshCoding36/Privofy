import React from 'react';
import { motion } from 'framer-motion';
import './AirQualityCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'; // Speedometer icon


const AirQualityCard = ({ data }) => {
  data = parseInt(data, 10);
  
  const metrics = [
    { name: 'Score', value: `${data}/100`, icon: faTachometerAlt },
  ];

  const getMetricCategory = () => {
    if (data <= 30) return { category: 'Low', color: 'bad' };
    if (data <= 60) return { category: 'Moderate', color: 'moderate' };
    if (data <= 80) return { category: 'Good', color: 'good' };
    return { category: 'Excellent', color: 'excellent' };
  };
  const getScoreColor = (score) => {
    if (score <= 30) return '#b71c1c'; // Red for bad scores
    if (score <= 60) return '#ff9800'; // Yellow for moderate scores
    return '#4caf50'; // Green for good scores
  };
  
  const getHealthBarWidth = () => Math.min(data, 100);

  return (
    <motion.div 
      className="air-quality-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h2>Privacy Policy Information</h2>
        <p>Details about the currently uploaded privacy policy</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const { category, color } = getMetricCategory();
          const healthBarWidth = getHealthBarWidth();

          return (
            <motion.div 
              key={metric.name}
              className="metric-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="metric-name">
              <FontAwesomeIcon 
    icon={faTachometerAlt} 
    className="metric-icon"
    style={{ color: getScoreColor(data) }} // Dynamic color
  />
                {metric.name}
              </div>
              <div className={`metric-value ${color}`}>{metric.value}</div>
              <div className="metric-category">{category}</div>
              <div className="health-bar">
                <div 
                  className={`health-bar-fill ${color}`}
                  style={{ width: `${healthBarWidth}%` }}
                ></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AirQualityCard;
