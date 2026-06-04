/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    serverComponentsExternalPackages: ["@modelcontextprotocol/sdk"]
  }
};

export default nextConfig;
