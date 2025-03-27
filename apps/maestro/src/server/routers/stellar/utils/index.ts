import type { StellarChainConfig } from "@axelarjs/api";

import { stellarChainConfig } from "~/config/chains";
import type { Context } from "~/server/context";

export const formatTokenId = (tokenId: string) => {
  const hex = tokenId.replace(/^0x/, "").padStart(64, "0");
  return Buffer.from(hex, "hex");
};

export const getStellarChainConfig = async (
  ctx: Context
): Promise<StellarChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  const chainConfig = chainConfigs.chains[stellarChainConfig.axelarChainId];
  if (chainConfig.chainType !== "stellar") {
    throw new Error("Invalid chain config");
  }

  return chainConfig;
};

export const stellarNetworkPassphrase = "Test SDF Network ; September 2015";

export const stellarEncodedRecipient = (
  destinationAddress: string
): `0x${string}` => `0x${Buffer.from(destinationAddress).toString("hex")}`;
