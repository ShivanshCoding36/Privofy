import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { postReview, getReviews } from '../utils/apiService';
import './ReviewSection.css';

const ReviewSection = ({ location, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewsa = async () => {
      try {
        const reviewsData = await getReviews(location);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      }
    };
    if (location) {
      fetchReviewsa();
    }
  }, [location]);

  const fetchReviews = async () => {
    try {
      const reviewsData = await getReviews(location);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Please log in to post a review');
      return;
    }
    
    if (!content.trim()) {
      setError('Review content cannot be empty');
      return;
    }
    
    if (content.length > 250) {
      setError('Review content cannot exceed 250 words');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `review-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('public').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
      
      // Post review
      await postReview(location, content, imageUrl);
      
      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Error posting review:', error);
      setError('Failed to post review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h2>Community Reviews</h2>
        {userId && (
          <motion.button 
            className="add-review-button"
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? 'Cancel' : 'Add Review'}
          </motion.button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <AnimatePresence>
        {showForm && (
          <motion.form 
            className="review-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="review-content">Your Review (max 250 words)</label>
              <textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts about air quality in your area..."
                maxLength={1000}
                required
              />
            </div>
            
            <div className="image-upload">
              <label htmlFor="review-image" className="image-upload-button">
                {imagePreview ? 'Change Image' : 'Add Image (Optional)'}
              </label>
              <input
                type="file"
                id="review-image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>
            
            <div className="form-buttons">
              <motion.button 
                type="submit"
                className="submit-button"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Posting...' : 'Post Review'}
              </motion.button>
              <motion.button 
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              className="review-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="review-user">
                <img 
                  src={review.user_profiles.avatar_url || '/images/default-avatar.png'} 
                  alt="User" 
                  className="user-avatar" 
                />
                <div>
                  <div className="user-name">{review.user_profiles.username || 'Anonymous'}</div>
                  <div className="review-date">{formatDate(review.created_at)}</div>
                </div>
              </div>
              <div className="review-content">{review.content}</div>
              {review.image_url && (
                <img src={review.image_url} alt="Review" className="review-image" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="no-reviews">
            No reviews yet for this location. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 