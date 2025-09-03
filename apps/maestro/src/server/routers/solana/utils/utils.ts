import { SolanaChainConfig } from "@axelarjs/api";

import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

import { solanaChainConfig } from "~/config/chains/vm-chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import type { Context } from "~/server/context";

export const getSolanaChainConfig = async (
  ctx: Context
): Promise<SolanaChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  // Determine the best key based on environment and available S3 keys
  const s3Keys = Object.keys(chainConfigs.chains);
  const solanaKeys = s3Keys.filter((k) => k.toLowerCase().includes("solana"));
  const preferredKey = solanaChainConfig?.axelarChainId || "solana";

  // Helper to pick best candidate per env
  const pickKeyForEnv = (env: typeof NEXT_PUBLIC_NETWORK_ENV) => {
    const lower = (v: string) => v.toLowerCase();
    if (env === "devnet-amplifier") {
      return (
        solanaKeys.find((k) => lower(k).includes("solana-2")) ||
        solanaKeys.find((k) => lower(k).includes("devnet")) ||
        solanaKeys[0]
      );
    }
    if (env === "testnet") {
      return (
        solanaKeys.find((k) => lower(k).includes("testnet")) || solanaKeys[0]
      );
    }
    // mainnet default
    return (
      solanaKeys.find((k) => lower(k).includes("mainnet")) || solanaKeys[0]
    );
  };

  const chainConfig = (chainConfigs.chains[preferredKey] ||
    chainConfigs.chains[pickKeyForEnv(NEXT_PUBLIC_NETWORK_ENV)]) as
    | SolanaChainConfig
    | undefined;

  if (!chainConfig || chainConfig.chainType !== "svm") {
    console.error("[SolanaConfig] Invalid Solana chain config", {
      preferredKey,
      env: NEXT_PUBLIC_NETWORK_ENV,
      availableKeys: s3Keys,
      resolved: chainConfig && {
        id: (chainConfig as any).id,
        chainType: (chainConfig as any).chainType,
      },
    });
    throw new Error("Invalid Solana chain config");
  }

  return chainConfig;
};

export async function getItsProgramId(ctx: Context): Promise<PublicKey> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const itsAddr = (chainConfig.config as any)?.contracts?.InterchainTokenService
    ?.address as string | undefined;
  if (!itsAddr) {
    throw new Error(
      "InterchainTokenService address not found in Solana config"
    );
  }
  const fromConfig = new PublicKey(itsAddr);

  return fromConfig;
}

export async function getGatewayProgramId(ctx: Context): Promise<PublicKey> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const gatewayAddr = (chainConfig.config as any)?.contracts?.AxelarGateway
    ?.address as string | undefined;
  if (!gatewayAddr) {
    throw new Error("AxelarGateway address not found in Solana config");
  }
  const fromConfig = new PublicKey(gatewayAddr);

  return fromConfig;
}

export async function getAxelarGasServiceProgramId(
  ctx: Context
): Promise<PublicKey> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const gasServiceAddr = (chainConfig.config as any)?.contracts
    ?.AxelarGasService?.address as string | undefined;
  if (!gasServiceAddr) {
    throw new Error("AxelarGasService address not found in config");
  }
  const fromConfig = new PublicKey(gasServiceAddr);

  return fromConfig;
}

export function ensureHex(input: string): string {
  return input.startsWith("0x") || input.startsWith("0X")
    ? input.slice(2)
    : input;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = ensureHex(hex);
  return Buffer.from(clean, "hex");
}

export function hexToBytes32(hex: string): number[] {
  const clean = ensureHex(hex);
  const normalized =
    clean.length > 64 ? clean.slice(0, 64) : clean.padStart(64, "0");
  return Array.from(Buffer.from(normalized, "hex"));
}

export function stringToBytes(input: string): Uint8Array {
  // If hex-like, parse as hex; else treat as utf8 bytes
  if (/^(0x)?[0-9a-fA-F]+$/.test(input)) {
    return hexToBytes(input);
  }
  return Buffer.from(input, "utf8");
}

export async function getMetadata(tokenAddress: string, ctx: Context) {
  const solanaConfig = await getSolanaChainConfig(ctx);
  const connection = new Connection(solanaConfig.config.rpc[0], "confirmed");
  const metaplex = Metaplex.make(connection);

  try {
    const mint = new PublicKey(tokenAddress);
    const tokenMetadata = await metaplex.nfts().findByMint({
      mintAddress: mint,
    });
    const name = tokenMetadata.name ?? "Unknown";
    const symbol = tokenMetadata.symbol ?? "Unknown";

    // Fetch mint for decimals
    const mintInfo = await connection.getParsedAccountInfo(mint);
    const decimals =
      (mintInfo.value?.data as any)?.parsed?.info?.decimals ??
      tokenMetadata.mint?.decimals ??
      null;

    return {
      name,
      symbol,
      decimals,
    } as any;
  } catch {
    return null as any;
  }
}

// Borsh encoding helpers
export function encodeVariantU8(index: number): Buffer {
  if (index < 0 || index > 255) throw new Error("variant index out of range");
  return Buffer.from([index]);
}

export function encodeU32LE(value: number): Buffer {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("encodeU32LE expects a non-negative integer");
  }
  const b = Buffer.alloc(4);
  b.writeUInt32LE(value, 0);
  return b;
}

export function encodeU64LE(value: bigint | number | string): Buffer {
  const big = typeof value === "bigint" ? value : BigInt(value);
  if (big < 0n) throw new Error("encodeU64LE expects non-negative");
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(big, 0);
  return b;
}

export function encodeStringBorsh(value: string): Buffer {
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([encodeU32LE(bytes.length), bytes]);
}
