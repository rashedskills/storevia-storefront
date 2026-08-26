import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "storevia.test",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],

    // Only bypass Next image optimization locally.
    // Production will use optimization normally.
    unoptimized: isDevelopment,
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;