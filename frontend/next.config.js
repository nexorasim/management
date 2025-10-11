/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
    GRAPHQL_URL: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3000/api/v1'}/:path*`,
      },
    ];
  },
  images: {
    domains: ['enterprise.myesimplus.com'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;