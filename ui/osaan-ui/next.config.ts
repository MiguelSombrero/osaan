import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for development with proxied APIs
  output: "standalone",
};

export default nextConfig;
