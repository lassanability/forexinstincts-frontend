/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 's3.swiftsyn.com',
      },
    ],
  }
};

module.exports = nextConfig;