import path from "path";
import { fileURLToPath } from "url";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const HOSTNAMES = [
  "testnet.axelar.network",
  "testnet.axelarscan.io",
  "axelar.network",
  "axelarscan.io",
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: HOSTNAMES.map((hostname) => ({ hostname })),
  },
  transpilePackages: [
    "@xrpl-wallet-standard/app",
    "@xrpl-wallet-standard/core",
    "@xrpl-wallet-standard/react",
    "@xrpl-wallet-adapter/base",
    "@xrpl-wallet-adapter/crossmark",
    "@xrpl-wallet-adapter/ledger",
    "@xrpl-wallet-adapter/walletconnect",
    "@xrpl-wallet-adapter/xaman",
    "@walletconnect/modal",
  ],
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Fix for @xrpl-wallet-standard/react build issues
    if (!dev && !isServer) {
      // Exclude from minification to prevent "ul is not a function" errors
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin) => {
          if (plugin.constructor.name === "TerserPlugin") {
            plugin.options.exclude = /node_modules\/@xrpl-wallet-standard/;
          }
          return plugin;
        }
      );
    }

    // Provide SSR-safe aliases
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use a lightweight SSR shim to avoid importing browser-only XRPL provider on the server
        "@xrpl-wallet-standard/react": path.resolve(
          __dirname,
          "src/shims/xrpl-wallet-standard-react.server.tsx"
        ),
        // Avoid importing client-only WalletConnect modal on the server (ESM-only)
        "@walletconnect/modal": false,
        "styled-components": "styled-components/dist/styled-components.cjs.js",
      };
    }

    return config;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "axelar-network",
    project: `interchain-maestro-${process.env.NEXT_PUBLIC_NETWORK_ENV}`,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
