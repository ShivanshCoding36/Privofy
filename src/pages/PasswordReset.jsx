import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔑 Detect recovery mode from QUERY PARAMS (NOT hash)
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const type = params.get("type");
  const isResetMode = token && type === "recovery";

  // 🔐 CRITICAL: Exchange recovery token for session
  useEffect(() => {
    const verifyRecovery = async () => {
      if (isResetMode) {
        const { error } = await supabase.auth.verifyOtp({
          token,
          type: "recovery",
        });

        if (error) {
          setError("Invalid or expired reset link.");
        }
      }
    };

    verifyRecovery();
  }, [isResetMode, token]);

  // 📩 Request password reset email
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a password reset link.");
    }

    setLoading(false);
  };

  // 🔑 Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <div className="reset-container">
      <h2>{isResetMode ? "Set a New Password" : "Reset Your Password"}</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {!isResetMode ? (
        <form onSubmit={handleRequestReset}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
