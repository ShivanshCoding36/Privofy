import React, { useState, useEffect, useRef } from 'react';
import { motion,  } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { initializePayPal } from '../utils/paymentService';
import './Pricing.css';

const pricingPackages = [
  { id: 3, credits: 100, price: 2, popular: false },
  { id: 4, credits: 150, price: 3, popular: false },
  { id: 5, credits: 200, price: 4, popular: false },
  { id: 6, credits: 300, price: 5, popular: false },
  { id: 7, credits: 400, price: 6, popular: true },
  { id: 8, credits: 500, price: 7, popular: false },
  { id: 9, credits: 750, price: 9, popular: false },
  { id: 10, credits: 1000, price: 12, popular: false },
];

const Pricing = () => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const paypalButtonsRef = useRef(null);
  
  // const { scrollYProgress } = useScroll();
  // const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  // const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  useEffect(() => {
    // Get authenticated user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Get user's local currency
    const getUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data && data.currency) {
          setCurrency(data.currency);
          
          // Get exchange rate if not USD
          if (data.currency !== 'USD') {
            const rateResponse = await fetch(
              `https://api.exchangerate-api.com/v4/latest/USD`
            );
            const rateData = await rateResponse.json();
            
            if (rateData && rateData.rates && rateData.rates[data.currency]) {
              setExchangeRate(rateData.rates[data.currency]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to get currency information:', error);
      }
    };
    
    getUserCurrency();
    
    // Initialize PayPal
    initializePayPal();
  }, []);

  const handlePurchase = async (packageId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    const pkg = pricingPackages.find(p => p.id === packageId);
    setSelectedPackage(pkg);
    
    // Clear any existing PayPal buttons
    if (paypalButtonsRef.current) {
      paypalButtonsRef.current.innerHTML = '';
    }
    
    // Render PayPal buttons
    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: pkg.price.toString()
            },
            description: `${pkg.credits} Credits Purchase`
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          setLoading(true);
          
          // Capture the order
          const orderDetails = await actions.order.capture();
          
          // Verify payment on backend
          const { data: session } = await supabase.auth.getSession();
          const token = session?.session?.access_token;
          
          const response = await fetch('/api/verify-paypal-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: data.orderID,
              user_id: user.id,
              credits: pkg.credits,
              payment_details: orderDetails
            }),
          });
          
          const result = await response.json();
          
          if (result.error) {
            setError('Payment verification failed. Please contact support.');
          } else {
            alert(`Successfully purchased ${pkg.credits} credits!`);
            setSelectedPackage(null);
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          setError('Failed to process payment. Please try again later.');
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        setError('PayPal encountered an error. Please try again later.');
      }
    }).render(paypalButtonsRef.current);
  };

  return (
    <div className="pricing-page">
      <motion.div 
  className="pricing-header"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h1>Choose Your Plan</h1>
  <p>Get credits to access AI-powered insights about air quality in your area</p>
</motion.div>

      
      {error && <div className="error-message">{error}</div>}
      
      <motion.div 
        className="pricing-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Credits</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pricingPackages.map((pkg, index) => (
              <motion.tr 
                key={pkg.id}
                className={pkg.popular ? 'popular' : ''}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <td>
                  {pkg.credits} Credits
                  {pkg.popular && <span className="popular-tag">Most Popular</span>}
                </td>
                <td>
                  {currency} {(pkg.price * exchangeRate).toFixed(2)}
                </td>
                <td>
                  <motion.button 
                    className="buy-button"
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy Now
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      
      {selectedPackage && (
        <motion.div 
          className="paypal-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3>Complete your purchase</h3>
          <p>You are purchasing {selectedPackage.credits} credits for ${selectedPackage.price}</p>
          <div ref={paypalButtonsRef} className="paypal-buttons"></div>
          <button 
            className="cancel-button" 
            onClick={() => setSelectedPackage(null)}
            disabled={loading}
          >
            Cancel
          </button>
        </motion.div>
      )}
      
      <motion.div 
        className="pricing-info"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <h3>What can you do with credits?</h3>
        <ul>
          <li>Generate AI-powered insights about air quality (5 credits per insight)</li>
          <li>Get personalized recommendations to improve air quality in your area</li>
          <li>Understand health implications of current air quality levels</li>
        </ul>
        <p>New users get 12 free credits upon signup!</p>
      </motion.div>
    </div>
  );
};

export default Pricing; 