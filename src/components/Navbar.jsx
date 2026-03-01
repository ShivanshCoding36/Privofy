import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import Logo from '../assets/favicon.ico';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Correctly extracting subscription
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
  
    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      subscription?.subscription?.unsubscribe(); // Correctly unsubscribing
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
 
  

  return (
    <>
    <style>{`
      .divder {
        display: flex;
        align-items: center;
        margin: 0;
        width: 1px;
        height: 40px;
        background: #c9d6e8;;
      }
        .divder h1 {
        color: #2c3e50;
    font-size: 2em;
    text-align: center;
    margin: 0;
    padding-left: 10px;
        }
    `}</style>
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ opacity: 0.5, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <motion.div whileHover={{ scale: 1.03 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Link to="/" className="logo-container" >
          <img src={Logo} alt="Privofy Logo" />
          <div className="divder">
            <h1>Privofy</h1>
        </div>

        </Link>
        </motion.div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About Us
          </Link>
          {/* <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>
            Pricing
          </Link> */}
          {user ? (
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
          ) : null}
        </div>
        
        <div className="auth-buttons">
  {user ? (
    <motion.button 
      className="logout-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => supabase.auth.signOut()}
    >
      Logout
    </motion.button>
  ) : (
    <Link to="/login">
      <motion.button 
        className="login-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Login
      </motion.button>
    </Link>
  )}
</div>

      </div>
    </motion.nav></>
  );
};

export default Navbar; 
