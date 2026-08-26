import type {
  NextConfig,
} from "next";


const isDevelopment =
  process.env.NODE_ENV ===
  "development";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "storevia.test",
        port: "",
        pathname: "/wp-content/uploads/**",
      },

      {
        protocol: "https",
        hostname: "login.fashionspotbd.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],

    /*
     * For now, bypass Next.js image optimization
     * in production too.
     *
     * This avoids Vercel / WordPress remote image
     * fetching issues while the project is launching.
     */
    unoptimized: true,

    minimumCacheTTL: 3600,
  },
};


export default nextConfig;