import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Ensure better-sqlite3 is not bundled
  serverExternalPackages: ["better-sqlite3"],
  
  // Webpack configuration for native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle better-sqlite3 native module
      config.externals = config.externals || [];
      config.externals.push({
        "better-sqlite3": "commonjs better-sqlite3",
      });
    }
    return config;
  },
};

export default nextConfig;
