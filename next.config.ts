import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ["m.dirbal.ly"],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
      allowedOrigins: ["test.abdullah-hassan.com", "localhost:3000"],
    },
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
