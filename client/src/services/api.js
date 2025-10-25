// client/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// --- Add the Interceptor ---
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage on every request
    const token = localStorage.getItem('token'); 
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Important: return the config object so the request can proceed
    return config; 
  },
  (error) => {
    // Handle request errors (optional)
    return Promise.reject(error);
  }
);
// --- End Interceptor ---


/*
  Now, you don't strictly *need* the useEffect in AuthContext 
  that sets api.defaults.headers anymore, as the interceptor handles it. 
  However, keeping it doesn't hurt and provides a slight state synchronization benefit.
*/

export default api;