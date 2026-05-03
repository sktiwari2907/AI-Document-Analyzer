import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbo: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },

  // 2. Standard Webpack Alias configuration
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
