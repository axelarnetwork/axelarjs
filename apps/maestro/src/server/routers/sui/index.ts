import { SuiClient } from "@mysten/sui.js/client";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import config from "./config/testnet.json";

// Initialize SuiClient directly with RPC from config
const suiClient = new SuiClient({
  url: config.sui.rpc,
});
export const suiRouter = router({
  deployToken: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        name: z.string(),
        decimals: z.number(),
        skipRegister: z.boolean().optional(),
        walletAddress: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { symbol, name, decimals, walletAddress } = input;
        // TODO: create a service client if we plan to keep this
        const response = await fetch(
          "https://melted-fayth-nptytn-57e5d396.koyeb.app/deploy-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: walletAddress,
              name,
              symbol,
              decimals,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Deploy token request failed: ${response.statusText}`
          );
        }

        const respJSON = await response.json();
        const txBytes = respJSON.data.txBytes;

        return txBytes;
      } catch (error) {
        console.error("Failed to prepare token deployment:", error);
        throw new Error(
          `Token deployment preparation failed: ${error.message}`
        );
      }
    }),
  // Everything after this point is for the finalization of the deployment
  // And is not yet implemented
  finalizeDeployment: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        decimals: z.number(),
        skipRegister: z.boolean().optional(),
        txDigest: z.string(),
        objectChanges: z.array(z.any()),
      })
    )
    .mutation(({ input }) => {
      // TODO: Implement this
      try {
        // const { symbol, decimals, skipRegister, objectChanges } = input;

        return input;
      } catch (error) {
        console.error("Failed to finalize deployment:", error);
        throw new Error(`Deployment finalization failed: ${error.message}`);
      }
    }),

  completeRegistration: publicProcedure
    .input(
      z.object({
        txDigest: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await suiClient.getTransactionBlock({
          digest: input.txDigest,
          options: {
            showEvents: true,
          },
        });

        let tokenId;

        if (result.events) {
          const registerEvent = result.events.find((event) =>
            event.type.includes("::its::RegisterTokenEvent")
          );

          if (registerEvent?.parsedJson) {
            tokenId = registerEvent.parsedJson.token_id.id;
          }
        }

        return { tokenId };
      } catch (error) {
        console.error("Failed to complete registration:", error);
        throw new Error(`Registration completion failed: ${error.message}`);
      }
    }),
});
