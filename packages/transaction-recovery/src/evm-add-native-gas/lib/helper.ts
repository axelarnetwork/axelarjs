import {
  AxelarConfigClient,
  AxelarEVMChainConfig,
  GMPClient,
} from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

import "viem/window";

import {
  createWalletClient,
  custom,
  Hash,
  http,
  publicActions,
  TransactionReceipt,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { EvmAddNativeGasError } from "../error";
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

// Calculate the amount of native gas to be paid. If the amount is 0, then no native gas needs to be paid.
// Otherwise, the amount of native gas to be paid is the difference between the total amount of gas to be paid and the amount of gas already paid.
export async function calculateNativeGasFee(
  receipt: TransactionReceipt,
  sourceChain: string,
  destinationChain: string,
  estimatedGasUsed: number,
  dependencies: EvmAddNativeGasDependencies
): Promise<bigint> {
  const { axelarQueryClient } = dependencies;
  const _totalAmount = (await axelarQueryClient.estimateGasFee({
    sourceChain,
    destinationChain,
    gasLimit: BigInt(estimatedGasUsed),
    gasMultiplier: "auto",
  })) as string;

  const totalAmount = BigInt(_totalAmount);

  const { paidFee } = extractReceiptInfoForNativeGasPaid(receipt);

  return paidFee >= totalAmount ? BigInt(0) : totalAmount - paidFee;
}

export async function isInsufficientFeeTx(
  client: GMPClient,
  txHash: Hash,
  logIndex: number
) {
  const gmpTxs = await client.searchGMP({
    txHash: txHash,
    txLogIndex: logIndex,
    size: 1,
  });

  const gmpTx = gmpTxs[0];

  return gmpTx?.gas_status === "gas_paid_not_enough_gas";
}

export function getWalletClient(
  rpcUrl: string,
  privateKey?: `0x${string}`
): WalletClient {
  if (!privateKey && !window.ethereum) {
    throw EvmAddNativeGasError.WALLET_CLIENT_NOT_FOUND;
  }

  if (privateKey) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      transport: http(rpcUrl),
    }).extend(publicActions);
  } else {
    return createWalletClient({
      transport: custom(window.ethereum!),
    }).extend(publicActions);
  }
}
