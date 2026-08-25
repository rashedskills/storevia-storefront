import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.fashionspotbd.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],

    unoptimized: true,
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;