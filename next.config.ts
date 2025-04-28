import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "ui.shadcn.com",
      },
    ],
  },
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
