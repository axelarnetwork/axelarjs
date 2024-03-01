import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  AxelarscanClient,
  GMPClient,
} from "@axelarjs/api";

import { createPublicClient, getContract, http, parseAbi } from "viem";

import { EvmAddNativeGasParams } from "../types";
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
  const { evmSendOptions } = params;
  const { axelarscanClient, gmpClient, configClient } = dependencies;

  const chainConfigs = await axelarscanClient.getChainConfigs();

  const evmChainConfigs = chainConfigs.evm;

  const chainConfig = evmChainConfigs.find(
    (config) => config.id.toLowerCase() === params.chain.toLowerCase()
  );

  // Use the public RPC endpoint if it is not provided in the chain config
  const rpcUrl =
    chainConfig?.endpoints?.rpc?.[0] || evmSendOptions.evmWalletDetails?.rpcUrl;

  // Throw an error if the RPC endpoint is not found
  if (!rpcUrl || !chainConfig) {
    throw new Error(`Config not found for ${params.chain}`);
  }

  const chainId = chainConfig.chain_id;
  const nativeToken = chainConfig.native_token;

  const client = createPublicClient({
    transport: http(rpcUrl),
  });

  const receipt = await client.getTransactionReceipt({
    hash: params.txHash,
  });

  const { destChain, logIndex } = extractReceiptInfoForNativeGasPaid(receipt);

  // Throw an error if the destination chain is not found from the GMP event details.
  if (!destChain) {
    throw new Error("Invalid GMP Tx");
  }

  // Check if the transaction requires native gas to be paid.
  const shouldAddNativeGas = await isInsufficientFeeTx(
    gmpClient,
    params.txHash,
    logIndex
  );

  // Throw an error if the transaction does not require native gas to be paid.
  if (!shouldAddNativeGas) {
    throw new Error("This transaction does not require native gas paid.");
  }

  // Calculate the amount of native gas to be paid.
  const gasToAdd = await calculateNativeGasFee(
    receipt,
    params.chain,
    destChain,
    params.estimatedGasUsed,
    dependencies
  );

  // Throw an error if the amount of native gas to be paid is 0.
  if (gasToAdd === BigInt(0)) {
    throw new Error("Gas paid was sufficient. No need to add gas.");
  }

  const gasServiceAddress = await getGasServiceAddressFromChainConfig(
    configClient,
    evmSendOptions.environment,
    destChain
  );

  if (!gasServiceAddress) {
    throw new Error(`Gas service address not found for ${destChain}`);
  }

  const walletClient = getWalletClient(
    rpcUrl,
    evmSendOptions.evmWalletDetails?.privateKey
  );

  const [accountAddress] = await walletClient.requestAddresses();

  const refundAddress = evmSendOptions.refundAddress || accountAddress;

  if (!refundAddress) {
    throw new Error("Refund address not found");
  }

  if (!accountAddress) {
    throw new Error("Account address not found");
  }

  console.log({
    address: gasServiceAddress,
    account: accountAddress,
    chain: {
      id: chainId,
      name: params.chain,
      nativeCurrency: nativeToken,
      rpcUrls: {
        default: {
          http: [rpcUrl],
        },
      },
    },
    value: gasToAdd,
    args: [params.txHash, BigInt(logIndex), refundAddress],
  });

  // return walletClient.writeContract({
  //   abi: parseAbi([
  //     "function addNativeGas(bytes32 txHash,uint256 logIndex,address refundAddress) external payable",
  //   ]),
  //   address: gasServiceAddress,
  //   account: walletClient.account.address,
  //   chain: {
  //     id: chainId,
  //     name: params.chain,
  //     nativeCurrency: nativeToken,
  //     rpcUrls: {
  //       default: {
  //         http: [rpcUrl],
  //       },
  //     },
  //   },
  //   functionName: "addNativeGas",
  //   value: 1n,
  //   args: [params.txHash, BigInt(logIndex), refundAddress],
  // });

  console.log("contract addr", gasServiceAddress);

  const contract = getContract({
    abi: parseAbi([
      "function addNativeGas(bytes32 txHash,uint256 logIndex,address refundAddress) external payable",
    ]),
    address: gasServiceAddress,
    client: {
      wallet: walletClient,
    },
  });

  console.log([params.txHash, BigInt(logIndex), refundAddress]);

  return contract.write.addNativeGas(
    [params.txHash, BigInt(logIndex), refundAddress],
    {
      account: accountAddress!,
      chain: {
        id: chainId,
        name: params.chain,
        nativeCurrency: nativeToken,
        rpcUrls: {
          default: {
            http: [rpcUrl],
          },
        },
      },
      value: gasToAdd,
    }
  );
}
