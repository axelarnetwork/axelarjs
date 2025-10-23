import path from "path";
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
    '@xrpl-wallet-standard/app',
    '@xrpl-wallet-standard/core',
    '@xrpl-wallet-standard/react',
    '@xrpl-wallet-adapter/base',
    '@xrpl-wallet-adapter/crossmark',
    '@xrpl-wallet-adapter/ledger',
    '@xrpl-wallet-adapter/walletconnect',
    '@xrpl-wallet-adapter/xaman',
    '@walletconnect/modal',
  ],
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Fix for @xrpl-wallet-standard/react build issues
    if (!dev && !isServer) {
      // Exclude from minification to prevent "ul is not a function" errors
      config.optimization.minimizer = config.optimization.minimizer.map((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.exclude = /node_modules\/@xrpl-wallet-standard/
        }
        return plugin
      })
    }

    // Handle SSR issues with @xrpl-wallet-standard packages
    if (isServer) {
      // Externalize XRPL packages during SSR to prevent styled-components errors
      const existingExternals = config.externals || []
      config.externals = [
        ...(Array.isArray(existingExternals) ? existingExternals : [existingExternals]),
        (ctx) => {
          if (ctx.request && typeof ctx.request === 'string') {
            if (ctx.request.includes('@xrpl-wallet-standard/react')) {
              return true
            }
            if (ctx.request.includes('@xrpl-wallet-standard/app')) {
              return true
            }
            if (ctx.request.includes('@xrpl-wallet-standard/core')) {
              return true
            }
          }
          return false
        }
      ]
    }

    // Provide styled-components polyfill for SSR
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'styled-components': 'styled-components/dist/styled-components.cjs.js',
      }
    }

    return config
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
