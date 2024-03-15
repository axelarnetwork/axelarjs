/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  createPublicClient,
  http,
  parseAbi,
  type HttpTransport,
  type PublicClient,
} from "viem";

import { type EstimateL1FeeParams } from "./types";

/**
 * Get the estimated L1 fee for a given L2 chain.
 * @param env The environment to use. Either "mainnet" or "testnet".
 * @param chain The destination L2 chain.
 * @param params The parameters to use for the estimation.
 * @returns
 */
export async function getL1FeeForL2(
  rpcUrl: string,
  params: EstimateL1FeeParams
): Promise<bigint> {
  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  switch (params.l2Type) {
    case "op":
      return getOptimismL1Fee(publicClient, params);
    case "mantle":
      return getMantleL1Fee(publicClient, params);
    // Most of the ethereum clients are already included L1 fee in the gas estimation for Arbitrum.
    case "arb":
    default:
      return 0n;
  }
}

async function getOptimismL1Fee(
  publicClient: PublicClient<HttpTransport>,
  estimateL1FeeParams: EstimateL1FeeParams
) {
  const { executeData, l1GasOracleAddress } = estimateL1FeeParams;

  const contractAddress =
    l1GasOracleAddress || "0x420000000000000000000000000000000000000F";
  const abi = parseAbi(["function getL1Fee(bytes) returns (uint256)"]);

  const fee = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getL1Fee",
    args: [executeData],
  });

  return fee;
}

async function getMantleL1Fee(
  publicClient: PublicClient<HttpTransport>,
  estimateL1FeeParams: EstimateL1FeeParams
) {
  const { l1GasPrice, l1GasOracleAddress } = estimateL1FeeParams;
  const contractAddress =
    l1GasOracleAddress || "0x420000000000000000000000000000000000000F";

  const abi = parseAbi(["function overhead() returns (uint256)"]);

  const fixedOverhead = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "overhead",
    args: [],
  });

  const gasPrice = BigInt(l1GasPrice.value);

  return fixedOverhead * gasPrice;
}
