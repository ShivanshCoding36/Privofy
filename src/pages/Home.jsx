import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaGlobeAmericas, FaSearch, FaLightbulb, FaCheckCircle, FaLock } from 'react-icons/fa'; 
import { MdOutlineFlagCircle, MdOutlineLanguage } from 'react-icons/md'; // Added Material Design icons
import '../styles/Home.css';

const featuresData = [
  { 
    icon: <FaLightbulb />, 
    title: "AI-Powered Decoding", 
    description: "Integrated with advanced AI models to decode complex legal jargon into clear, actionable insights." 
  },
  { 
    icon: <FaGlobeAmericas />, 
    title: "No Language Barrier", 
    description: "Read or listen to policy summaries in multiple Indian and Foreign languages, breaking down communication hurdles." 
  },
  { 
    icon: <MdOutlineFlagCircle />, // New Icon for Flags
    title: "Red & Green Flags", 
    description: "Instantly spot 'Red Flags' for data-hungry clauses and 'Green Flags' for companies that truly respect your privacy." 
  },
  { 
    icon: <MdOutlineLanguage />, // New Icon for Internet Analysis
    title: "Universal Web Analysis", 
    description: "Simply paste a URL to analyze any privacy policy directly from the internet without leaving the app." 
  },
  { 
    icon: <FaSearch />, 
    title: "Extensive Policy Library", 
    description: "Reference pre-analyzed policies from a growing database, ensuring quick security checks on major platforms." 
  },
  { 
    icon: <FaShieldAlt />, 
    title: "Transparent Safety Score", 
    description: "Get a clear, color-coded safety score that instantly reveals your data's risk exposure with any company." 
  }
];

const Home = () => {
  const ref = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="home-container" ref={ref}>
      
      {/* Background Decor */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="badge">
              <FaCheckCircle /> v2.0 Now Live
            </motion.div>
            <motion.h1 variants={itemVariants} className="main-tagline">
              Privacy Decoded.<br />
              <span className="text-gradient">Risks Revealed.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="sub-tagline">
              Don't just click 'Accept'. Use AI to analyze privacy policies instantly and discover what data they are really taking.
            </motion.p>
            <motion.div variants={itemVariants} className="hero-buttons">
              <Link to="/dashboard" className="primary-button">Start Analysing</Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="shield-container">
              <motion.div 
                className="floating-shield"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <FaLock className="shield-icon" />
              </motion.div>
              <div className="shield-glow"></div>
              
              {/* Floating Cards */}
              <motion.div className="float-card card-1" animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <span>Data Tracking</span>
                <strong>Detected</strong>
              </motion.div>
              <motion.div className="float-card card-2" animate={{ x: [-30, 0, -30] }} transition={{ repeat: Infinity, duration: 5 }}>
                <span>Safety Score</span>
                <strong>85/100</strong>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Survey Section (Glassmorphism) */}
      <motion.section 
        className="stats-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="glass-container">
          <div className="stat-block">
            <h3 className="count-up">90%</h3>
            <p>Users fear unauthorized data collection</p>
          </div>
          <div className="divider"></div>
          <div className="stat-block">
            <h3 className="count-up highlight">11%</h3>
            <p>Users actually read privacy policies</p>
          </div>
          
        </div>
        <p className="source-text">Source: CUTS International & Exploding Topics</p>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Privofy is Your <span className="highlight-text">Digital Shield</span>
          </motion.h2>
          <p>We combine advanced legal AI with simple visuals to protect your identity.</p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <motion.div 
              key={index} 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              viewport={{once: true, amount:.3}}
            >
              <div className="icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="cta-wrapper">
        <motion.div 
          className="cta-box"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to reclaim your privacy?</h2>
          <p>Stop guessing. Start knowing. Analyse your first policy in seconds.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/signup" className="cta-btn-large">Create Free Account</Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
