import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      alert('Password reset link sent to your email');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
  className="login-card"
  initial={{ opacity: 0, scale: 0.95 }} 
  animate={{ opacity: 1, scale: 1 }} 
  transition={{ duration: 0.5 }}
>

        <h1>Welcome Back</h1>
        <p>Sign in to access your air quality dashboard</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailLogin}>
  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>
  
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  
  {/* Log In button moved up */}
  <motion.button 
    type="submit"
    className="login-button"
    disabled={loading}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    {loading ? 'Logging in...' : 'Log In'}
  </motion.button>
</form>

{/* Forgot Password button moved below Log In */}
<button 
  className="forgot-password"
  onClick={handleForgotPassword}
  disabled={loading}
>
  Forgot your password?
</button>

        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <div className="oauth-buttons">
{/*           <motion.button 
            className="google-button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaGoogle /> Sign in with Google
          </motion.button> */}
          
          <motion.button 
            className="github-button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaGithub /> Sign in with GitHub
          </motion.button>
        </div>
        
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 
