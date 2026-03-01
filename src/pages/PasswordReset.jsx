import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./ResetPassword.css";
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setError(
          "Your password reset link is invalid or has expired. Please request a new one."
        );
        setHasSession(false);
        return;
      }

      setHasSession(true);
    };

    checkSession();
  }, []);

  const getPasswordRuleState = (pwd) => ({
    length: pwd.length >= 8,
    number: /\d/.test(pwd),
    lower: /[a-z]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    special: /[!@#$%^&*]/.test(pwd),
  });

  const rules = getPasswordRuleState(password);
  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!hasSession) {
      setError(
        "Your password reset link is invalid or has expired. Please request a new one."
      );
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password reset successful. Redirecting to Dashboard...");
    setLoading(false);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <>
    <Navbar />
    <div className="reset-container">
      <h2>Reset Your Password</h2>

      {message && <h3 className="success-message">{message}</h3>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleResetPassword}>
        
         <div className="form-group password-input">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
        <div className="password-rules-box">
          <div className="password-hint">Password must contain:</div>
          <ul className="password-rules">
            <li
              className={`password-rule ${
                rules.length ? "rule-valid" : "rule-invalid"
              }`}
            >
              <span className="rule-icon">{rules.length ? "✅" : "❌"}</span>
              At least 8 characters
            </li>
            <li
              className={`password-rule ${
                rules.number ? "rule-valid" : "rule-invalid"
              }`}
            >
              <span className="rule-icon">{rules.number ? "✅" : "❌"}</span>
              At least 1 number (0–9)
            </li>
            <li
              className={`password-rule ${
                rules.lower ? "rule-valid" : "rule-invalid"
              }`}
            >
              <span className="rule-icon">{rules.lower ? "✅" : "❌"}</span>
              At least 1 lowercase letter (a–z)
            </li>
            <li
              className={`password-rule ${
                rules.upper ? "rule-valid" : "rule-invalid"
              }`}
            >
              <span className="rule-icon">{rules.upper ? "✅" : "❌"}</span>
              At least 1 uppercase letter (A–Z)
            </li>
            <li
              className={`password-rule ${
                rules.special ? "rule-valid" : "rule-invalid"
              }`}
            >
              <span className="rule-icon">{rules.special ? "✅" : "❌"}</span>
              At least 1 special symbol (!@#$%^&*)
            </li>
          </ul>
        </div>
        <button type="submit" disabled={loading || !isPasswordValid}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
    </>
  );
};

export default ResetPassword;
