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
};

export default nextConfig;
