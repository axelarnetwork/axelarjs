import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  AxelarscanClient,
  GMPClient,
} from "@axelarjs/api";

import { createPublicClient, getContract, http, parseAbi } from "viem";

import { EvmAddNativeGasParams } from "../types";
import { EvmAddNativeGasError } from "./error";
import { extractReceiptInfoForNativeGasPaid } from "./lib/getReceiptInfo";
import {
  calculateNativeGasFee,
  getGasServiceAddressFromChainConfig,
  getWalletClient,
  isInsufficientFeeTx,
} from "./lib/helper";

export type EvmAddNativeGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  gmpClient: GMPClient;
};

export async function addNativeGas(
  params: EvmAddNativeGasParams,
  dependencies: EvmAddNativeGasDependencies
) {
  const { environment, evmSendOptions, estimatedGasUsed, srcChain, txHash } =
    params;
  const { axelarscanClient, gmpClient, configClient } = dependencies;
  const { amount, gasMultiplier, privateKey, refundAddress, rpcUrl } =
    evmSendOptions;

  const chainConfigs = await axelarscanClient.getChainConfigs();
  const evmChainConfigs = chainConfigs.evm;
  const chainConfig = evmChainConfigs.find(
    (config) => config.id.toLowerCase() === params.srcChain.toLowerCase()
  );

  // Use the public RPC endpoint if it is not provided in the chain config
  const srcChainRpcUrl = chainConfig?.endpoints?.rpc?.[0] || rpcUrl;

  // Throw an error if the RPC endpoint is not found
  if (!srcChainRpcUrl || !chainConfig) {
    throw EvmAddNativeGasError.CHAIN_CONFIG_NOT_FOUND(params.srcChain);
  }

  const chainId = chainConfig.chain_id;
  const nativeToken = chainConfig.native_token;

  const client = createPublicClient({
    transport: http(srcChainRpcUrl),
  });

  const srcTxReceipt = await client.getTransactionReceipt({
    hash: txHash,
  });

  const { destChain, logIndex } =
    extractReceiptInfoForNativeGasPaid(srcTxReceipt);

  // Throw an error if the destination chain is not found from the GMP event details.
  if (!destChain) {
    throw EvmAddNativeGasError.INVALID_GMP_TX;
  }

  // Check if the transaction requires native gas to be paid.
  const shouldAddNativeGas = await isInsufficientFeeTx(
    gmpClient,
    params.txHash,
    logIndex
  );

  // Throw an error if the transaction does not require native gas to be paid.
  if (!shouldAddNativeGas) {
    throw EvmAddNativeGasError.ENOUGH_PAID;
  }

  const bigIntAmount = BigInt(amount || "0");

  // Calculate the amount of native gas to be paid. Skip the calculation if the amount is provided.
  const gasToAdd =
    bigIntAmount > 0n
      ? bigIntAmount
      : await calculateNativeGasFee(
          srcTxReceipt,
          srcChain,
          destChain,
          estimatedGasUsed,
          dependencies.axelarQueryClient,
          gasMultiplier
        );

  // Throw an error if the amount of native gas to be paid is 0.
  if (gasToAdd === BigInt(0)) {
    throw EvmAddNativeGasError.ENOUGH_PAID;
  }

  const gasServiceAddress = await getGasServiceAddressFromChainConfig(
    configClient,
    environment,
    destChain
  );

  if (!gasServiceAddress) {
    throw new Error(`Gas service address not found for ${destChain}`);
  }

  const walletClient = getWalletClient(srcChainRpcUrl, privateKey);

  const [senderAddress] = await walletClient.requestAddresses();

  const actualRefundAddress = refundAddress || senderAddress;

  if (!actualRefundAddress) {
    throw EvmAddNativeGasError.REFUND_ADDRESS_NOT_FOUND;
  }

  if (!senderAddress) {
    throw EvmAddNativeGasError.SENDER_ADDRESS_NOT_FOUND;
  }

  const contract = getContract({
    abi: parseAbi([
      "function addNativeGas(bytes32 txHash,uint256 logIndex,address refundAddress) external payable",
    ]),
    address: gasServiceAddress,
    client: {
      wallet: walletClient,
    },
  });

  return contract.write.addNativeGas(
    [params.txHash, BigInt(logIndex), actualRefundAddress],
    {
      account: senderAddress!,
      chain: {
        id: chainId,
        name: params.srcChain,
        nativeCurrency: nativeToken,
        rpcUrls: {
          default: {
            http: [srcChainRpcUrl],
          },
        },
      },
      value: gasToAdd,
    }
  );
}
