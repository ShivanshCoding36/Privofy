import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">

        {/* Brand / SEO Description */}
        <div className="footer-section">
          <h3>Privofy</h3>
          <p>
            Privofy is an AI-powered privacy policy analyzer that helps users
            understand data usage, risks, red flags, green flags, and safety
            scores before accepting terms and conditions.
          </p>
        </div>

        {/* Legal Links */}
        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="lis">
            <li>
              <Link to="/privacy-policy">
                Privacy Policy – How Privofy Handles Your Data
              </Link>
            </li>
            <li>
              <Link to="/terms">
                Terms & Conditions of Using Privofy
              </Link>
            </li>
          </ul>
        </div>

        {/* Founder / Trust */}
        <div className="footer-section">
          <h3>Founder</h3>
          <p>
            Built by Shivansh Mathur, focused on making online privacy
            understandable and transparent for everyone.
          </p>
          <div className="social-icons">
            <a
              href="https://www.linkedin.com/in/shivanshmathur9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shivansh Mathur on LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:shivanshmathur221@gmail.com"
              aria-label="Email the founder of Privofy"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://www.youtube.com/@shivanshmathur9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Founder YouTube channel"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>
            Have questions about privacy policies or AI analysis?
            Reach out to us.
          </p>
          <div className="social-icons">
            <a
              href="mailto:aeroaware.help@gmail.com"
              aria-label="Contact Privofy support"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Privofy — AI Privacy Policy Analyzer.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
