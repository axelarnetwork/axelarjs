/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Environment } from "@axelarjs/core";

import { createPublicClient, http, parseAbi, PublicClient } from "viem";

import {
  EstimateL1FeeParams,
  L2Chain,
  MAINNET_L2_CHAINS,
  TESTNET_L2_CHAINS,
} from "./types";

/**
 * Get the estimated L1 fee for a given L2 chain.
 * @param env The environment to use. Either "mainnet" or "testnet".
 * @param chain The destination L2 chain.
 * @param params The parameters to use for the estimation.
 * @returns
 */
export function getL1FeeForL2(
  env: Environment,
  chain: L2Chain,
  params: EstimateL1FeeParams
): Promise<bigint> {
  const chains = env === "mainnet" ? MAINNET_L2_CHAINS : TESTNET_L2_CHAINS;
  const publicClient = createPublicClient({
    chain: chains[chain],
    transport: http(),
  });

  switch (chain) {
    // Most of the ethereum clients are already included L1 fee in the gas estimation for Arbitrum.
    case "arbitrum":
      return Promise.resolve(0n);
    case "optimism":
    case "scroll":
    case "base":
      return getOptimismL1Fee(publicClient, params);
    case "mantle":
      return getMantleL1Fee(publicClient, params);
  }
}

async function getOptimismL1Fee(
  publicClient: PublicClient,
  estimateL1FeeParams: EstimateL1FeeParams
) {
  const { l1GasPrice, executeData } = estimateL1FeeParams;

  const contractAddress = "0x420000000000000000000000000000000000000F";
  const abi = parseAbi([
    "function getL1GasUsed(bytes) returns (uint256)",
    "function scalar() returns (uint256)",
    "function overhead() returns (uint256)",
  ]);

  const multicallResponse = await publicClient.multicall({
    contracts: [
      {
        address: contractAddress,
        abi,
        functionName: "getL1GasUsed" as never,
        args: [executeData],
      },
      {
        address: contractAddress,
        abi,
        functionName: "scalar" as never,
        args: [],
      },
      {
        address: contractAddress,
        abi,
        functionName: "overhead" as never,
        args: [],
      },
    ],
  });

  const [gasUsed, dynamicOverhead, fixedOverhead] = multicallResponse.flatMap(
    (r) => r.result
  ) as [bigint, bigint, bigint];

  const totalGasUsed =
    ((gasUsed + fixedOverhead) * dynamicOverhead) / 1_000_000n;
  const gasPrice = BigInt(l1GasPrice.value);

  return totalGasUsed * gasPrice;
}

// TODO: Not used for now because the gas estimation is already included the L1 fee by default.
// async function getArbitrumL1Fee(
//   publicClient: PublicClient,
//   destinationContractAddress: string,
//   executeData: string
// ) {
//   // Arbitrum NodeInterface contract address
//   const contractAddress = "0x00000000000000000000000000000000000000C8";

//   // https://github.com/OffchainLabs/nitro-contracts/blob/0a149d2af9aee566c4abf493479ec15e5fc32d98/src/node-interface/NodeInterface.sol#L112
//   const abi = parseAbi([
//     "function gasEstimateL1Component(address to, bool contractCreation, bytes calldata data) external payable returns (uint64,uint256,uint256)",
//   ]);

//   const fee = (await publicClient.readContract({
//     address: contractAddress,
//     abi,
//     functionName: "gasEstimateL1Component" as never,
//     args: [destinationContractAddress, false, executeData],
//   })) as [bigint, bigint, bigint];

//   return fee[0];
// }

async function getMantleL1Fee(
  publicClient: PublicClient,
  estimateL1FeeParams: EstimateL1FeeParams
) {
  const contractAddress = "0x420000000000000000000000000000000000000F";
  const { l1GasPrice } = estimateL1FeeParams;

  const abi = parseAbi([
    "function overhead() returns (uint256)",
    "function scalar() returns (uint256)",
  ]);

  const multicallResponse = await publicClient.multicall({
    contracts: [
      {
        address: contractAddress,
        abi,
        functionName: "overhead" as never,
        args: [],
      },
      {
        address: contractAddress,
        abi,
        functionName: "scalar" as never,
        args: [],
      },
    ],
  });

  const [fixedOverhead, dynamicOverhead] = multicallResponse.flatMap(
    (r) => r.result
  ) as [bigint, bigint];

  const totalGasUsed = (fixedOverhead * dynamicOverhead) / 1_000_000n;
  const gasPrice = BigInt(l1GasPrice.value);

  return totalGasUsed * gasPrice;
}
