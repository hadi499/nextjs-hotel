import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async headers() {
    return [
      {
        source: "/api/payment/notification/:path*", // Menerapkan CORS ke semua route
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, X-Custom-Header, Upgrade-Insecure-Requests, Cache-Control, Pragma",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cili7jis98fhhtqt.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
