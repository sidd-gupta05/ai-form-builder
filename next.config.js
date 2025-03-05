// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
module.exports = {
    async rewrites() {
      return [
        { source: "/dashboard/analytics", destination: "/api/analytics" }, // 👀 Check API route
      ];
    },
  };
  