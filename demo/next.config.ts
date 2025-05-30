import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  experimental: {
    externalDir: true,
  },
  /* config options here */
};

export default nextConfig;
