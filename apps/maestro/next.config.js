const nextTranspileModules = require("next-transpile-modules");
const withTM = nextTranspileModules(["@axelarjs/ui"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["testnet.axelarscan.io"],
  },
};

module.exports = withTM(nextConfig);
