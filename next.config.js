/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for GoDaddy Phusion Passenger deployment
  output: 'standalone',

  // Allow images from any domain (adjust as needed)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
