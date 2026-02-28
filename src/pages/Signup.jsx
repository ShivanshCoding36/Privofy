import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import supabase from '../utils/supabaseClient';
import '../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordRuleState = (pwd) => ({
    length: pwd.length >= 8,
    number: /\d/.test(pwd),
    lower: /[a-z]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    special: /[!@#$%^&*]/.test(pwd),
  });

  const rules = getPasswordRuleState(formData.password);
  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSocialLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          scopes: 'read:user',
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Handle successful social login
      if (data) {
        // Add initial credits for new user
        // await addInitialCredits(data.user.id);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // const addInitialCredits = async (userId) => {
  //   try {
  //     const { error } = await supabase
  //       .from('profiles')
  //       .upsert({
  //         user_id: userId,
  //         credits: 10,
  //         created_at: new Date()
  //       });
  //     if (error) throw error;
  //   } catch (error) {
  //     console.error('Error adding initial credits:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });
      
      if (error) throw error;
      
      // Add initial credits
      // await addInitialCredits(data.user.id);
      alert('Signup successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join Privofy to get insights on <b>privacy policies</b></p>
        
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group password-input">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-rules-box">
              <div className="password-hint">Password must contain:</div>
              <ul className="password-rules">
                <li className={`password-rule ${rules.length ? 'rule-valid' : 'rule-invalid'}`}>
                  <span className="rule-icon">{rules.length ? '✅' : '❌'}</span>
                  At least 8 characters
                </li>
                <li className={`password-rule ${rules.number ? 'rule-valid' : 'rule-invalid'}`}>
                  <span className="rule-icon">{rules.number ? '✅' : '❌'}</span>
                  At least 1 number (0–9)
                </li>
                <li className={`password-rule ${rules.lower ? 'rule-valid' : 'rule-invalid'}`}>
                  <span className="rule-icon">{rules.lower ? '✅' : '❌'}</span>
                  At least 1 lowercase letter (a–z)
                </li>
                <li className={`password-rule ${rules.upper ? 'rule-valid' : 'rule-invalid'}`}>
                  <span className="rule-icon">{rules.upper ? '✅' : '❌'}</span>
                  At least 1 uppercase letter (A–Z)
                </li>
                <li className={`password-rule ${rules.special ? 'rule-valid' : 'rule-invalid'}`}>
                  <span className="rule-icon">{rules.special ? '✅' : '❌'}</span>
                  At least 1 special symbol (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group password-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !isPasswordValid}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-auth-buttons">
{/*           <button 
            onClick={() => handleSocialLogin('google')}
            className="social-auth-btn google"
          >
            <FaGoogle /> Sign up with Google
          </button> */}
          <button 
            onClick={() => handleSocialLogin('github')}
            className="social-auth-btn github"
          >
            <FaGithub /> Sign up with GitHub
          </button>
        </div>

        

        
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;




