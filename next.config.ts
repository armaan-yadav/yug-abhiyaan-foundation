import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during production builds on the platform
    // This prevents build failures caused by lint warnings/errors.
    // NOTE: Prefer fixing lint problems long-term. Use this to unblock deploys.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
