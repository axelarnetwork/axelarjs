import { httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { ssrPrepass } from "@trpc/next/ssrPrepass";
import superjson from "superjson";

import { queryClient } from "~/config/wagmi";
import type { AppRouter } from "~/server/routers/_app";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // browser should use relative path
    return "";
  }
  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        queryClient,
        links: [
          splitLink({
            condition(op: { context?: { skipBatch?: boolean } }) {
              // Check for context property `skipBatch`
              return Boolean(op.context?.skipBatch);
            },
            // When condition is true, use normal request (no batching)
            true: httpLink({
              url: "/api/trpc",
              transformer: superjson,
            }),
            // When condition is false, use batching
            false: httpBatchLink({
              transformer: superjson,
              url: "/api/trpc",
            }),
          }),
        ],
      };
    }
    return {
      queryClient, // use shared queryClient
      links: [
        splitLink({
          condition(op: { context?: { skipBatch?: boolean } }) {
            // Check for context property `skipBatch`
            return Boolean(op.context?.skipBatch);
          },
          // When condition is true, use normal request (no batching)
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: superjson,
            headers() {
              if (!ctx?.req?.headers) {
                return {};
              }
              const { headers } = ctx.req;
              return {
                ...headers,
                // Optional: inform server that it's an SSR request
                "x-ssr": "1",
              };
            },
          }),
          // When condition is false, use batching
          false: httpBatchLink({
            transformer: superjson,
            url: `${getBaseUrl()}/api/trpc`,
            /**
             * Set custom request headers on every request from tRPC
             * @link https://trpc.io/docs/v10/header
             */
            headers() {
              if (!ctx?.req?.headers) {
                return {};
              }

              // To use SSR properly, you need to forward the client's headers to the server
              // This is so you can pass through things like cookies when we're server-side rendering
              // If you're using Node 18, omit the "connection" header
              const { headers } = ctx.req;

              return {
                ...headers,
                // Optional: inform server that it's an SSR request
                "x-ssr": "1",
              };
            },
          }),
        }),
      ],
    };
  },
  ssr: true,
  ssrPrepass,
  transformer: superjson,
});
