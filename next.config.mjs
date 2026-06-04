/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.kapruka.com",
      "kapruka.com",
      "images.kapruka.com",
      "cdn.kapruka.com"
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["@modelcontextprotocol/sdk"]
  }
};

export default nextConfig;
