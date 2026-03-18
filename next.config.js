/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async rewrites() {
    return [
      { source: "/app", destination: "/dashboard" },
      { source: "/app/:path*", destination: "/:path*" },
    ];
  },
};

module.exports = nextConfig;
