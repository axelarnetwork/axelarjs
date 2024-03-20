import { partition } from "rambda";
import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import { scanInterchainTokenOnChainByTokenId } from "./findInterchainTokenByTokenId";

export const recoverCanonicalTokenByTokenId = protectedProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
      deploymentMessageId: hex64Literal().optional(),
      deployerAddress: hex40Literal().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { postgres } = ctx.persistence;

    const onChainData = await scanInterchainTokenOnChainByTokenId(
      input.tokenId,
      ctx,
    );

    const successResults = onChainData.filter(
      (result) => result.status === "success",
    );

    if (successResults.length === 0) {
      throw new Error("no success results");
    }

    const [[originToken], remoteTokens] = partition(
      (result) => result.tokenManagerType === "lock_unlock",
      successResults,
    );

    if (!originToken || originToken.status !== "success") {
      throw new Error("no origin token");
    }

    // persist origin token
    await postgres.recordInterchainTokenDeployment({
      ...originToken,
      kind: "canonical",
      salt: "0x",
      deploymentMessageId: input.deploymentMessageId ?? "0x",
      deployerAddress: input.deployerAddress ?? "0x",
    });

    // persist remote tokens

    if (!remoteTokens.length) {
      return;
    }

    const insertData = remoteTokens
      .filter((token) => token.status === "success")
      .map((token) => {
        if (token.status !== "success") {
          throw new Error("unexpected token status");
        }
        return {
          ...token,
          deployerAddress: input.deployerAddress,
          deploymentMessageId: input.deploymentMessageId ?? "0x-0",
          deploymentStatus: "confirmed" as const,
        };
      });

    await postgres.recordRemoteInterchainTokenDeployments(insertData);
  });
