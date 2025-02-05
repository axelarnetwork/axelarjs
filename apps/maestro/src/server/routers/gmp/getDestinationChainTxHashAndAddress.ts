import { partition } from "rambda";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  deploymentMessageId: z.string(),
  chainIds: z.array(z.string()),
  tokenId: z.string(),
});
/**
 * This function is used to fetch destination transaction hashes and addresses when deploying
 * interchain tokens from Sui to EVM chains. Since Sui uses a different transaction format,
 * we need to:
 *
 * 1. Query Axelarscan's GMP API to find the initial cross-chain message
 * 2. Extract the second hop message ID from the callback
 * 3. Query again to get the destination chain transaction hash
 * 4. Use the tokenId to query the ITS contract directly for the registered token address
 *    on the destination chain
 *
 * This allows us to track the full deployment flow across chains and obtain both the
 * transaction hash and deployed token address. However, this information takes too long to be available
 * through this approach and we should look for a more efficient solution.
 */

export const getDestinationChainTxHashAndAddress = publicProcedure
  .input(INPUT_SCHEMA)
  .mutation(async ({ input, ctx }) => {
    const baseUrl = "https://devnet-amplifier.api.axelarscan.io/gmp/searchGMP";

    async function searchGMP(messageId: string) {
      const response = await fetch(`${baseUrl}?messageId=${messageId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      console.log("response data:", data);
      return data;
    }

    const maxRetries = 20;
    const delay = 3000;

    for (let i = 0; i < maxRetries; i++) {
      const firstHopResult = await searchGMP(input.deploymentMessageId);
      const secondHopMessageId =
        firstHopResult[0]?.callback?.returnValues?.messageId;

      if (secondHopMessageId) {
        for (let j = 0; j < maxRetries; j++) {
          const secondHopResult = await searchGMP(secondHopMessageId);

          if (secondHopResult?.[0]?.status === "executed") {
            const destinationTxHash =
              secondHopResult[0]?.executed?.transactionHash;

            const [[chainConfig]] = partition(
              (chain) => {
                return chain.axelarChainId === input.chainIds[0];
              }, // TODO: handle multiple chains
              ctx.configs.wagmiChainConfigs
            );
            const itsClient =
              ctx.contracts.createInterchainTokenServiceClient(chainConfig);
            const destinationChainAddress = await itsClient.reads
              .registeredTokenAddress({
                tokenId: input.tokenId as `0x${string}`,
              })
              .catch((e) => {
                console.log("error in isRegistered", e);
                return false;
              });
            if (destinationTxHash) {
              const result = {
                destinationTxHash,
                destinationChainAddress,
              };
              return result;
            }
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return {
      destinationTxHash: "",
      destinationChainAddress: "",
    };
  });
