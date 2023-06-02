/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination:
            `${process.env.WORKER_API}/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
