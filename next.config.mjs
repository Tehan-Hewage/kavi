/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint 9 is incompatible with Next.js 14's built-in lint runner (which
  // uses removed ESLint 8 flags). Skip during build; run `npm run lint` separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.kapruka.com",
      },
      {
        protocol: "http",
        hostname: "**.kapruka.com",
      },
      {
        protocol: "https",
        hostname: "kapruka.com",
      },
      {
        protocol: "http",
        hostname: "kapruka.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "http",
        hostname: "cdn.shopify.com",
      }
    ]
  },
  serverExternalPackages: ["@modelcontextprotocol/sdk"],
};

export default nextConfig;
