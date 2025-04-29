import { z } from "zod";

import { CHAIN_CONFIGS } from "~/config/chains";
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

      console.log({ url, chainName, json });
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

export const healthcheckRouter = router({
  getSingleRpcStatus: publicProcedure
    .input(
      z.object({
        env: z.enum(["mainnet", "testnet", "devnet-amplifier"]),
        chainName: z.string(),
      })
    )
    .query(async ({ input }) => {
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
      return { status };
    }),

  getRpcStatus: publicProcedure
    .input(
      z.object({
        env: z.enum(["mainnet", "testnet", "devnet-amplifier"]),
      })
    )
    .query(async ({ input }) => {
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
            // Only check the first RPC URL
            results[chainName] = await checkRpcNode(urls[0], chainName);
          }
        )
      );
      return results;
    }),
});
