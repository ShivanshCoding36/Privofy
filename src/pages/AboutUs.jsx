import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import whatWeDoImg from '../assets/images/what-we-do.jpg';
import ourMissionImg from '../assets/images/our-mission.jpg';
import founderImg from '../assets/images/founder.jpg';

const AboutUs = () => {
  const ref = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: ref,
  //   offset: ["start end", "end start"]
  // });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const cards = [
    {
      id: 1,
      title: "What We Do",
      description: "Privofy simplifies privacy policies for users. Many people don't read or understand privacy policies, which allows companies to exploit user data. Our platform lets users upload or search for a privacy policy, which our AI model analyzes and explains in simple terms. This ensures users know what they agree to, reducing risks like data leaks and spam.",
      image: whatWeDoImg,
      // buttonText: "View Pricing",
      // buttonLink: "/pricing"
    },
    {
      id: 2,
      title: "Our Mission",
      description: "Our mission is to help users understand the privacy policies they accept daily. By providing AI-driven insights and safety scores, we aim to make privacy policies accessible to everyone, from tech-savvy individuals to those unfamiliar with legal terms. We believe this transparency will push companies to improve their policies and protect user data.",
      image: ourMissionImg
    },
    {
      id: 3,
      title: "About the Founder",
      description: "Shivansh Mathur envisioned Privofy as a revolutionary platform to bridge the gap between users and their digital privacy. With a deep background in Artificial Intelligence (AI) and Machine Learning (ML), he recognized the growing concerns around data privacy and related legal matters. Experiencing firsthand how difficult it is to understand privacy policies, he dedicated his expertise to building an AI-driven solution that simplifies and explains complex policies. Privofy aims to empower users with clear, concise, and actionable insights, ensuring they stay informed about their data security in an evolving digital landscape.",
      image: founderImg
    }
  ];

  return (
    <div className="about-page" ref={ref}>
      

      <div className="cards-container">
        {cards.map((card, index) => (
          <motion.div 
            key={card.id}
            className={`info-card ${index % 2 === 0 ? 'left-image' : 'right-image'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className="card-image-container">
              <img src={card.image} loading="lazy" alt={card.title} />
            </div>
            <div className="card-content">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              {card.buttonText && (
                <motion.button 
                  className="cta-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={card.buttonLink}>{card.buttonText}</Link>
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


export default AboutUs; 
