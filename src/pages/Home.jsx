import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaLeaf, FaChartLine, FaBell } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container" ref={ref}>
      
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1 }}
          >
            Feel Safe Online with Privofy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.3 }}
          >
            Analyse and understand Privacy Policy before accepting
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/signup" className="primary-button">Get Started</Link>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1 }}
          >
            Privofy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.3 }}
          >
            Privacy decoded, risks revealed 
          </motion.p>
          
        </div>
      </motion.section>

      {/* Current Air Quality Section */}
      <section className="air-quality-section">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Data Privacy Survey Results
        </motion.h2>
        
        <motion.div 
          className="air-quality-card"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aqi-display" id='display'>
            <h3>People scared of Unauthorised data collection</h3>
            <motion.div 
              className="scared aqi-value"
              whileHover={{ scale: 1.05 }}
            >
              90%
            </motion.div>
          </div>
          <div className="pollutant-details">
            <motion.div 
              className="read"
              whileHover={{ scale: 1.05 }}
            >
              <span>People who read Privacy Policy: </span>
              <span>11 %</span>
            </motion.div>
          </div>
          <span> A survey conducted by CUTS International and exploding topics</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Why Choose Privofy?
        </motion.h2>

        <div className="features-grid">
          {[ 
            { icon: <FaMapMarkerAlt />, title: "Model Accuracy", description: "Integrated with Google's Gemini model for better understanding of Privacy policy." },
            { icon: <FaLeaf />, title: "No Language Barrier", description: "Important details of Privacy policy can be heard and read in different languages." },
            { icon: <FaChartLine />, title: "Large Dataset", description: "Access and understand several privacy policies from a large dataset." },
            { icon: <FaBell />, title: "Safety Score", description: "Understand how safe your data is with the company." }
          ].map((feature, index) => (
            <motion.div 
              // key={index} 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.15 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Start Understanding Data Security Today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Join users who trust Privofy for their data security.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/signup" className="cta-button">Create Free Account</Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
