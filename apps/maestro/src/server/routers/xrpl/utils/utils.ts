import { XRPLChainConfig } from "@axelarjs/api";

import { xrplChainConfig } from "~/config/chains/vm-chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import type { Context } from "~/server/context";

import * as xrpl from "xrpl";

export const getXRPLChainConfig = async (
  ctx: Context
): Promise<XRPLChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  // Determine the best key based on environment and available S3 keys
  const s3Keys = Object.keys(chainConfigs.chains);
  const xrplKeys = s3Keys.filter((k) => k.toLowerCase().includes("xrpl")).filter((k) => !k.toLowerCase().includes("evm"));
  const preferredKey = xrplChainConfig?.axelarChainId || "xrpl";

  // Helper to pick best candidate per env
  const pickKeyForEnv = (env: typeof NEXT_PUBLIC_NETWORK_ENV) => {
    const lower = (v: string) => v.toLowerCase();
    if (env === "devnet-amplifier") {
      return (
        xrplKeys.find((k) => lower(k).includes("xrpl-dev")) ||
        xrplKeys.find((k) => lower(k).includes("devnet")) ||
        xrplKeys[0]
      );
    }
    if (env === "testnet") {
      return (
        xrplKeys.find((k) => lower(k).includes("testnet")) || xrplKeys[0]
      );
    }
    // mainnet default
    return (
      xrplKeys.find((k) => lower(k).includes("mainnet")) || xrplKeys[0]
    );
  };

  const chainConfig = (chainConfigs.chains[preferredKey] ||
    chainConfigs.chains[pickKeyForEnv(NEXT_PUBLIC_NETWORK_ENV)]) as
    | XRPLChainConfig
    | undefined;

  if (!chainConfig || chainConfig.chainType !== "xrpl") {
    console.error("[XRPLConfig] Invalid XRPL chain config", {
      preferredKey,
      env: NEXT_PUBLIC_NETWORK_ENV,
      availableKeys: s3Keys,
      resolved: chainConfig && {
        id: (chainConfig as any).id,
        chainType: (chainConfig as any).chainType,
      },
    });
    throw new Error("Invalid XRPL chain config");
  }

  return chainConfig;
};

export function hex(str: string) {
    return Buffer.from(str).toString('hex');
}

export function parseTokenAmount(token: string, amount: string) {
    let parsedAmount;

    if (token === 'XRP') {
        parsedAmount = amount; //xrpl.xrpToDrops(amount); // already in drops
    } else {
        const [currency, issuer] = token.split('.');
        parsedAmount = {
            currency,
            issuer,
            value: amount,
        };
    }

    return parsedAmount;
}