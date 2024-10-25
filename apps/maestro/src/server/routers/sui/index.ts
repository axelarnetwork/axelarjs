import path from "path";
import { copyMovePackage, TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SuiClient } from "@mysten/sui.js/client";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import config from "./config/testnet.json";

const moveDir = path.resolve("./src/server/routers/sui/move");
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
        const { symbol, name, decimals, skipRegister, walletAddress } = input;
        copyMovePackage("interchain_token", null, moveDir);

        // Define token options
        const interchainTokenOptions = {
          symbol,
          name,
          decimals,
        };

        // Create transaction builder
        const txBuilder = new TxBuilder(suiClient);

        const cap = await txBuilder.publishInterchainToken(
          moveDir,
          interchainTokenOptions
        );
        txBuilder.tx.transferObjects([cap], walletAddress);

        // Serialize the transaction
        const serializedTx = await txBuilder.tx.toJSON();

        return { cap, serializedTx };
      } catch (error) {
        console.error("Failed to prepare token deployment:", error);
        throw new Error(
          `Token deployment preparation failed: ${error.message}`
        );
      }
    }),

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
    .mutation(async ({ input }) => {
      // TODO: Implement this
      try {
        const { symbol, decimals, skipRegister, objectChanges } = input;

        return;
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
