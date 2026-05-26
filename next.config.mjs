/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
    // If the API URL points to the frontend itself (e.g. during local development),
    // we rewrite to the actual backend server running on port 5050 to prevent an infinite loop.
    if (apiUrl.includes('localhost:3000') || apiUrl.includes('127.0.0.1:3000')) {
      apiUrl = 'http://localhost:5050/api';
    }
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
