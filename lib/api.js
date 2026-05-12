// API URL is set via NEXT_PUBLIC_API_URL environment variable.
// Use a fallback for safety, but the env var should always be set.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hms-new-backend-2.onrender.com/api';

export const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://hms-new-frontend.vercel.app';
