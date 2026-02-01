import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaYoutube, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Privofy</h3>
          <p>
Privofy is an AI-powered web application that analyzes privacy policies and explains
data usage, risks, red flags, green flags, and safety scores in simple language.</p>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="lis">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Founder</h3>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/shivanshmathur9" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:shivanshmathur221@gmail.com">
              <FaEnvelope />
            </a>
            <a href="https://www.youtube.com/@shivanshmathur9" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://youtube.com/airquality" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href="mailto:aeroaware.help@gmail.com">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Privofy. All rights reserved.</p>
      </div>
    </footer>
  );
};


export default Footer; 
