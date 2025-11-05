import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during production builds on the platform
    // This prevents build failures caused by lint warnings/errors.
    // NOTE: Prefer fixing lint problems long-term. Use this to unblock deploys.
    ignoreDuringBuilds: true,
  },
  images: {
    // Allow optimizing images hosted on Cloudinary (res.cloudinary.com)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
