import type { XRPLChainConfig } from "@axelarjs/api/axelar-config";

import { xrplChainConfig } from "~/config/chains/vm-chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import type { Context } from "~/server/context";
import Decimal from "decimal.js";

const isXRPLChainConfig = (c: unknown): c is XRPLChainConfig => {
  return (c as { chainType?: string })?.chainType === "xrpl";
};

export const getXRPLChainConfig = async (
  ctx: Context
): Promise<XRPLChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  // Determine the best key based on environment and available S3 keys
  const s3Keys = Object.keys(chainConfigs.chains);
  const xrplKeys = s3Keys
    .filter((k) => k.toLowerCase().includes("xrpl"))
    .filter((k) => !k.toLowerCase().includes("evm"));
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
      return xrplKeys.find((k) => lower(k).includes("testnet")) || xrplKeys[0];
    }
    // mainnet default
    return xrplKeys.find((k) => lower(k).includes("mainnet")) || xrplKeys[0];
  };

  const chainConfig =
    chainConfigs.chains[preferredKey] ??
    chainConfigs.chains[pickKeyForEnv(NEXT_PUBLIC_NETWORK_ENV)];

  if (!isXRPLChainConfig(chainConfig)) {
    console.error("[XRPLConfig] Invalid XRPL chain config", {
      preferredKey,
      env: NEXT_PUBLIC_NETWORK_ENV,
      availableKeys: s3Keys,
      resolved: chainConfig && {
        id: (chainConfig as { id?: string }).id,
        chainType: (chainConfig as { chainType?: string }).chainType,
      },
    });
    throw new Error("Invalid XRPL chain config");
  }

  return chainConfig;
};

export function hex(str: string) {
  return Buffer.from(str).toString("hex");
}

export const xrplEncodedRecipient = (
  destinationAddress: string
): `0x${string}` => `0x${hex(destinationAddress)}`;

export function parseTokenAmount(token: string, amountInDrops: string) {
  let parsedAmount;
  const parsedToken = parseXRPLTokenAddress(token);

  if (parsedToken === null) {
    parsedAmount = amountInDrops;
  } else {
    const { currency, issuer } = parsedToken;
    // assert: amount != "0"
    // the token has 15 decimals -> add a decimal point between the 14th and the 15th from the right
    const amount = Decimal(amountInDrops).times(1e-15);

    parsedAmount = {
      currency,
      issuer,
      value: amount.toFixed(15).replace(/0+$/, "").replace(/\.$/, ""), // TODO: just cast to float, and loose precision which is acceptable and required
    };
  }

  return parsedAmount;
}

export function parseTokenGasValue(token: string, amount: string) {
  if (token === "XRP") {
    return amount;
  } else {
    return Decimal(amount)
      .times(1e-15)
      .toFixed(15)
      .replace(/0+$/, "")
      .replace(/\.$/, ""); // TODO: cannot cast to float, but if resulting number has too many digits, remove them from the right
  }
}


export function parseXRPLTokenAddress(
  token: string
): { currency: string; issuer: string } | null {
  if (token === "XRP") {
    return null;
  }
  const normalized = token.trim();
  // Ensure exactly one dot separator
  const firstDot = normalized.indexOf(".");
  if (firstDot === -1 || firstDot !== normalized.lastIndexOf(".")) {
    throw new Error(
      "Invalid XRPL token address format. Expected CURRENCY.ISSUER or XRP"
    );
  }
  const [rawCurrency, rawIssuer] = normalized.split(".");
  const currency = rawCurrency.trim();
  const issuer = rawIssuer.trim();
  if (!currency || !issuer) {
    throw new Error(
      "Invalid XRPL token address format. Expected CURRENCY.ISSUER or XRP"
    );
  }
  return { currency, issuer };
}
