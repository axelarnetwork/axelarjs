import { z } from "zod";

import { CHAIN_CONFIGS } from "~/config/chains";
import { sendRpcNodeIssueNotificationWithRateLimit } from "~/lib/utils/slack-notifications";
import { publicProcedure, router } from "~/server/trpc";

async function checkRpcNode(
  url: string,
  chainName: string
): Promise<"up" | "down" | "timeout"> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 25000); // will timeout if RPC node dont respond in 25s
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method:
            chainName.toLowerCase() === "sui"
              ? "sui_getTotalTransactionBlocks"
              : chainName.toLowerCase() === "stellar"
                ? "getLatestLedger"
                : "eth_blockNumber",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let json;
      try {
        json = await response.json();
      } catch (error) {
        return "down";
      }

      // Verify if the response is valid
      if (!response.ok) return "down";
      if (!json || json.error) {
        return "down";
      }
      if (typeof json.result !== "string" && typeof json.result !== "object") {
        return "down";
      }

      return "up";
    } catch (error) {
      clearTimeout(timeout);
      // Check if this was an AbortError (timeout)
      if (error instanceof DOMException && error.name === "AbortError") {
        return "timeout";
      }
      return "down";
    }
  } catch {
    return "down";
  }
}

// Check if caching is disabled via environment variable
const DISABLE_CACHE = process.env.DISABLE_CACHE === "true";

export const healthcheckRouter = router({
  getSingleRpcStatus: publicProcedure
    .input(
      z.object({
        env: z.enum(["mainnet", "testnet", "devnet-amplifier"]),
        chainName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Create a cache key for this specific RPC health check
      const cacheKey = `rpc-health:${input.env}:${input.chainName}`;
      const CACHE_TTL = 120; // 2 minutes in seconds

      // Try to get the cached result first if caching is enabled
      if (!DISABLE_CACHE) {
        try {
          const cachedStatus = await ctx.persistence.kv.getCached<
            "up" | "down" | "timeout" | "unknown"
          >(cacheKey);
          if (cachedStatus) {
            return { status: cachedStatus };
          }
        } catch (error) {
          // If there's an error accessing the cache, we'll just proceed with the normal flow
          console.error("Error accessing KV cache:", error);
        }
      }

      // If no cache hit, proceed with the normal flow
      const chain = CHAIN_CONFIGS.find(
        (c) =>
          c.environment === input.env &&
          ((c.axelarChainName &&
            c.axelarChainName.toLowerCase() ===
              input.chainName.toLowerCase()) ||
            (c.name &&
              c.name.toLowerCase() === input.chainName.toLowerCase()) ||
            ((c as any).chain_name &&
              (c as any).chain_name.toLowerCase() ===
                input.chainName.toLowerCase()))
      );

      if (!chain) {
        return { status: "unknown" as const };
      }

      const chainName = chain.axelarChainName || chain.name;
      const urls = chain.rpcUrls?.default?.http || [];

      if (!urls.length) {
        return { status: "unknown" as const };
      }

      // Check the first RPC URL
      const status = await checkRpcNode(urls[0], chainName);

      // Send notification if RPC node is down or timing out
      if (status === "down" || status === "timeout") {
        // Send notification asynchronously (don't await)
        sendRpcNodeIssueNotificationWithRateLimit(
          chainName,
          status,
          urls[0],
          input.env,
          ctx.persistence.kv
        ).catch((error) => {
          console.error(
            `Error sending RPC issue notification for ${chainName}:`,
            error
          );
        });
      }

      // Cache the result for future requests if caching is enabled
      if (!DISABLE_CACHE) {
        try {
          await ctx.persistence.kv.setCached(cacheKey, status, CACHE_TTL);
        } catch (error) {
          console.error("Error setting KV cache:", error);
        }
      }

      return { status };
    }),

  getRpcStatus: publicProcedure
    .input(
      z.object({
        env: z.enum(["mainnet", "testnet", "devnet-amplifier"]),
      })
    )
    .query(async ({ input, ctx }) => {
      // Create a cache key for all RPC health checks for this environment
      const cacheKey = `rpc-health-all:${input.env}`;
      const CACHE_TTL = 120; // 2 minutes in seconds

      // Try to get the cached result first if caching is enabled
      if (!DISABLE_CACHE) {
        try {
          const cachedResults =
            await ctx.persistence.kv.getCached<
              Record<string, "up" | "down" | "timeout" | "unknown">
            >(cacheKey);
          if (cachedResults) {
            return cachedResults;
          }
        } catch (error) {
          // If there's an error accessing the cache, we'll just proceed with the normal flow
          console.error(
            "Error accessing KV cache for all RPC statuses:",
            error
          );
        }
      }

      // If no cache hit, proceed with the normal flow
      const results: Record<string, "up" | "down" | "timeout" | "unknown"> = {};
      await Promise.all(
        CHAIN_CONFIGS.filter((chain) => chain.environment === input.env).map(
          async (chain) => {
            const chainName = chain.axelarChainName || chain.name;
            const urls = chain.rpcUrls?.default?.http || [];
            if (!urls.length) {
              results[chainName] = "unknown";
              return;
            }

            // Check if we have a cached result for this specific chain if caching is enabled
            if (!DISABLE_CACHE) {
              const singleCacheKey = `rpc-health:${input.env}:${chainName}`;
              try {
                const cachedStatus = await ctx.persistence.kv.getCached<
                  "up" | "down" | "timeout" | "unknown"
                >(singleCacheKey);
                if (cachedStatus) {
                  results[chainName] = cachedStatus;
                  return;
                }
              } catch (error) {
                // If there's an error accessing the cache, we'll just proceed with checking the RPC
                console.error(
                  `Error accessing KV cache for ${chainName}:`,
                  error
                );
              }
            }

            // Only check the first RPC URL
            const status = await checkRpcNode(urls[0], chainName);
            results[chainName] = status;

            // Send notification if RPC node is down or timing out
            if (status === "down" || status === "timeout") {
              // Send notification asynchronously (don't await)
              sendRpcNodeIssueNotificationWithRateLimit(
                chainName,
                status,
                urls[0],
                input.env,
                ctx.persistence.kv
              ).catch((error) => {
                console.error(
                  `Error sending RPC issue notification for ${chainName}:`,
                  error
                );
              });
            }

            // Cache the individual result if caching is enabled
            if (!DISABLE_CACHE) {
              const singleCacheKey = `rpc-health:${input.env}:${chainName}`;
              try {
                await ctx.persistence.kv.setCached(
                  singleCacheKey,
                  status,
                  CACHE_TTL
                );
              } catch (error) {
                console.error(
                  `Error setting KV cache for ${chainName}:`,
                  error
                );
              }
            }
          }
        )
      );

      // Cache the complete results if caching is enabled
      if (!DISABLE_CACHE) {
        try {
          await ctx.persistence.kv.setCached(cacheKey, results, CACHE_TTL);
        } catch (error) {
          console.error("Error setting KV cache for all RPC statuses:", error);
        }
      }

      return results;
    }),
});
