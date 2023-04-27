/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@axelarjs/ui",
    "@axelarjs/utils",
    "@axelarjs/axelarscan",
  ],
  images: {
    domains: ["testnet.axelarscan.io"],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
