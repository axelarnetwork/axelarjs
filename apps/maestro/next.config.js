const nextTranspileModules = require("next-transpile-modules");
const withUI = nextTranspileModules(["@axelarjs/ui"]);
const withUTILS = nextTranspileModules(["@axelarjs/utils"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["testnet.axelarscan.io"],
  },
};

module.exports = withUTILS(withUI(nextConfig));
