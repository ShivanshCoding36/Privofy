// import { supabase } from './supabaseClient';
// // import axios from 'axios';
// // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
// // console.log(process.env.REACT_APP_API_BASE_URL)

// // export const getAirQualityData = async (location) => {
// //   try {
// //     const response = await axios.get(`${API_BASE_URL}/air-quality`, {
// //       params: { location }
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching air quality data:', error);
// //     throw error;
// //   }
// // };

// // export const getWeatherData = async (location) => {
// //   try {
// //     const response = await axios.get(`${API_BASE_URL}/weather`, {
// //       params: { location }
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching weather data:', error);
// //     throw error;
// //   }
// // };

// // export const postReview = async (location, content, imageUrl = null) => {
// //   try {
// //     const token = await getAuthToken();
    
// //     const response = await axios.post(
// //       `${API_BASE_URL}/user/review`,
// //       { location, content, image_url: imageUrl },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`
// //         }
// //       }
// //     );
    
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error posting review:', error);
// //     throw error;
// //   }
// // };

// // export const getReviews = async (location) => {
// //   try {
// //     const response = await axios.post(`${API_BASE_URL}/reviews`, { location });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching reviews:', error);
// //     throw error;
// //   }
// // };


// const getAuthToken = async () => {
//   const { data } = await supabase.auth.getSession();
//   if (!data.session) {
//     throw new Error("No active session found");
//   }
//   return data.session.access_token;
// };
