import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress Prisma Client bundling warnings in Next.js App Router
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
