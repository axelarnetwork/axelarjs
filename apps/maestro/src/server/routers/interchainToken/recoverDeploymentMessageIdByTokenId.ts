import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";

export const recoverDeploymentMessageIdByTokenId = protectedProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // constraint: token must be in db
    const { postgres } = ctx.persistence;

    const token = await postgres.getInterchainTokenByTokenId(input.tokenId);

    if (!token) {
      throw new Error("Token not found");
    }

    // is missing deploymentMessageId?
    if (!token.deploymentMessageId) {
      // try to find deployment tx hash from indexed events limiting by the token deployment timestamp

      const fromTime = (token.createdAt as Date).getTime() / 1000;
      const bufferLength = 60 * 60 * 8; // 8 hours
      const toTime = fromTime + bufferLength;

      const deployments = await ctx.services.gmp.searchGMP({
        contractMethod: ["InterchainTokenDeploymentStarted"],
        _source: {
          excludes: [
            "refunded",
            "refund_nonce",
            "receipt",
            "gas",
            "approved",
            "gas_price_rate",
            "fees",
            "gas_paid",
            "to_refund",
            "confirm",
            "command_id",
            "time_spent",
            "executed.receipt",
            "executed.transaction",
          ],
          includes: [
            "status",
            "call.transactionHash",
            "call.returnValues.destinationChain",
            "interchain_token_deployment_started.tokenId",
          ],
        },
        fromTime: fromTime,
        toTime: toTime,
        size: 1000,
      });

      const validEntries = deployments.filter(
        (x) =>
          x.interchain_token_deployment_started &&
          x.interchain_token_deployment_started.tokenId === input.tokenId
      );

      const results = validEntries.map((x) => {
        const logIndex = x.call.logIndex ?? x.call._logIndex ?? 0;
        return {
          status: x.status,
          destinationChain: x.call.returnValues.destinationChain,
          txHash: x.call.transactionHash,
          logIndex,
          deploymentMessageId: `${x.call.transactionHash}-${logIndex}`,
        };
      });

      if (results.length) {
        await postgres.updateInterchainTokenDeploymentMessageId(
          input.tokenId,
          results[0].deploymentMessageId
        );

        for (const result of results) {
          await postgres.updateRemoteInterchainTokenDeploymentMessageId(
            input.tokenId,
            result.destinationChain,
            result.deploymentMessageId
          );
        }

        return "updated";
      }
    }
  });
