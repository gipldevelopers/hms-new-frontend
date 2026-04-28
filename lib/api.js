// Determine the API URL based on the environment
export const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5050/api'
  : 'https://hms-new-backend-2.onrender.com/api';

export const CLIENT_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://hms-new-frontend.vercel.app';

console.log("System Initialization: API_URL =", API_URL);
