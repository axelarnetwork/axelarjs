import { AxelarConfigClient, AxelarEVMChainConfig } from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

import { TransactionReceipt } from "viem";

import { EvmAddNativeGasDependencies } from "../isomorphic";
import { extractReceiptInfoForNativeGasPaid } from "../lib/getReceiptInfo";

export async function getGasServiceAddressFromChainConfig(
  chainConfig: AxelarConfigClient,
  env: Environment,
  chain: string
) {
  const _chainConfigs = await chainConfig.getChainConfigs(env);
  const mapEvmChains: Record<string, AxelarEVMChainConfig> = Object.entries(
    _chainConfigs.chains
  )
    .filter(([, v]) => {
      return v.module === "evm";
    })
    .reduce((acc, [k, v]) => {
      acc[k] = v as AxelarEVMChainConfig;
      return acc;
    }, {} as Record<string, AxelarEVMChainConfig>);

  const srcChainConfig = mapEvmChains[chain.toLowerCase()];

  return srcChainConfig?.evmConfigs?.contracts?.gasService;
}

export async function calculateNativeGasFee(
  receipt: TransactionReceipt,
  sourceChain: string,
  destinationChain: string,
  estimatedGasUsed: number,
  dependencies: EvmAddNativeGasDependencies
): Promise<bigint> {
  const { axelarQueryClient } = dependencies;
  const totalAmount = (await axelarQueryClient.estimateGasFee({
    sourceChain,
    destinationChain,
    gasLimit: BigInt(estimatedGasUsed),
    gasMultiplier: "auto",
  })) as string;

  const { paidFee } = extractReceiptInfoForNativeGasPaid(receipt);

  return BigInt(totalAmount) - paidFee;
}
