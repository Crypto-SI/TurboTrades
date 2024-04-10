/** @type {import('next').NextConfig} */
const nextConfig = {
  "output": "export",
  reactStrictMode: false,
  
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.watchOptions = { poll: 1000, aggregateTimeout: 500 };
    return config;
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'dist',
};

export default nextConfig;