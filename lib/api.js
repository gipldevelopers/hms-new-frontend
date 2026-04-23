// Forcing the live URL to ensure it works in production
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hms-new-backend-2.onrender.com/api';
export const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://hms-new-frontend.vercel.app';

console.log("System Initialization: API_URL =", API_URL);
