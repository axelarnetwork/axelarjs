import { Connection, PublicKey } from "@solana/web3.js";
import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import {
  findInterchainTokenPda,
  findItsRootPda,
  findTokenManagerPda,
} from "../solana/utils/solanaPda";
import { getSolanaChainConfig } from "../solana/utils/utils";

export const updateSolanaRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { tokenId } = input;
    // Resolve Solana config and gateway PDA to compute ITS PDAs deterministically
    const solanaConfig = await getSolanaChainConfig(ctx);
    const itsAddr = (solanaConfig.config as any)?.contracts
      ?.InterchainTokenService?.address as string | undefined;
    const gatewayAddr = (solanaConfig.config as any)?.contracts?.AxelarGateway
      ?.address as string | undefined;
    if (!itsAddr || !gatewayAddr) {
      throw new Error(
        "Invalid Solana chain config: missing ITS or Gateway address"
      );
    }

    const itsProgramId = new PublicKey(itsAddr);
    const [itsRootPda] = findItsRootPda(itsProgramId);

    const tokenIdBytes = Buffer.from(tokenId.replace(/^0x/i, ""), "hex");
    const [mint] = findInterchainTokenPda(
      itsProgramId,
      itsRootPda,
      tokenIdBytes
    );
    const [tokenManagerPda] = findTokenManagerPda(
      itsProgramId,
      itsRootPda,
      tokenIdBytes
    );

    const rpcUrl = solanaConfig.config.rpc[0];
    const connection = new Connection(rpcUrl, "confirmed");
    const mintAccount = await connection.getAccountInfo(mint).catch(() => null);
    if (!mintAccount) {
      throw new Error("Mint account not found");
    }

    const tokenManagerAccount = await connection
      .getAccountInfo(tokenManagerPda)
      .catch(() => null);
    if (!tokenManagerAccount) {
      throw new Error("Token manager account not found");
    }

    // Update DB
    await ctx.persistence.postgres.updateSolanaRemoteTokenAddresses({
      tokenId,
      tokenAddress: mint.toBase58(),
      tokenManagerAddress: tokenManagerPda.toBase58(),
    });

    return "updated" as const;
  });
