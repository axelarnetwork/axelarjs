/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@axelarjs/ui", "@axelarjs/utils"],
  images: {
    domains: ["testnet.axelarscan.io"],
  },
};

module.exports = nextConfig;
