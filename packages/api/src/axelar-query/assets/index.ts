import fetch from "cross-fetch";

import type { Environment } from "../..";
import { AssetConfig, LoadAssetConfig } from "./types";

const urlMap: Record<Environment, string> = {
  devnet:
    "https://axelar-testnet.s3.us-east-2.amazonaws.com/devnet-asset-config.json",
  testnet:
    "https://axelar-testnet.s3.us-east-2.amazonaws.com/testnet-asset-config.json",
  mainnet:
    "https://axelar-mainnet.s3.us-east-2.amazonaws.com/mainnet-asset-config.json",
};
const assetMap: {
  [key in Environment]: { [key: string]: AssetConfig } | null;
} = {
  devnet: null,
  testnet: null,
  mainnet: null,
};

export async function loadAssets(
  config: LoadAssetConfig
): Promise<AssetConfig[]> {
  if (assetMap[config.environment])
    return Object.values(
      assetMap[config.environment] as { [key: string]: AssetConfig }
    );

  assetMap[config.environment] = await execGet(urlMap[config.environment]);

  return Object.values(
    assetMap[config.environment] as { [key: string]: AssetConfig }
  );
}

async function execGet(url: string): Promise<{ [key: string]: AssetConfig }> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = (await response.json()) as { [key: string]: AssetConfig };

    return result;
  } catch (error) {
    console.error({ error });
    throw error;
  }
}
