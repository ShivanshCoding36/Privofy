import React from 'react';
import './PrivacyTerms.css'; // Import the CSS file

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: March 2025</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Privofy. Your privacy is important to us, and we are committed to protecting your 
        personal data. This Privacy Policy explains how we collect, use, and safeguard your information 
        when you use our website.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, and payment details (if applicable).</li>
        <li><strong>Usage Data:</strong> Browser type, IP address, and user activity on our site.</li>
        <li><strong>Cookies & Tracking:</strong> We use cookies to improve user experience and analyze traffic.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide, operate, and improve our services.</li>
        <li>Analyze user behavior to enhance website functionality.</li>
        <li>Send updates, security alerts, and marketing communications (if opted in).</li>
      </ul>

      <h2>4. Data Protection & Security</h2>
      <p>
        We implement industry-standard security measures to protect your data. However, no online 
        transmission is 100% secure.
      </p>

      <h2>5. Third-Party Sharing</h2>
      <p>
        We do not sell your personal data. However, we may share information with service providers, 
        analytics tools, or as required by law.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You have the right to access, modify, or delete your personal information. Contact us at 
        <a href="mailto:support@privofy.com">support@privofy.com</a> for any privacy-related requests.
      </p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Please review it periodically for any changes.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
