import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  AxelarscanClient,
  GMPClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import { createPublicClient, type SupportedMainnetChain } from "@axelarjs/evm";

import {
  getContract,
  parseAbi,
  type Chain,
  type Hex,
  type WalletClient,
} from "viem";

import { getWalletClient } from "../common/client";
import type { EvmExecuteParams, EvmExecuteResult } from "./types";

export type EvmExecuteDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  gmpClient: GMPClient;
};

export type ExecutionDecision = {
  needsExecution: boolean;
  reason?: string | undefined;
  tx?: SearchGMPResponseData | undefined;
};

/**
 * Executes a cross-chain transaction on an EVM-compatible blockchain.
 *
 * @param params - Parameters for the execution
 * @param dependencies - External dependencies required for execution
 * @returns A promise that resolves to the execution result
 */
export async function evmExecute(
  params: EvmExecuteParams,
  dependencies: EvmExecuteDependencies
): Promise<EvmExecuteResult> {
  const { srcTxHash, srcTxLogIndex, executeOptions } = params;
  const { axelarscanClient, gmpClient } = dependencies;
  const { privateKey, rpcUrl } = executeOptions || {};

  // Check if the transaction needs to be executed
  const executionDecision = await shouldExecuteTransaction(
    srcTxHash,
    gmpClient,
    srcTxLogIndex
  );

  // If execution is not needed, return early with the reason
  if (!executionDecision.needsExecution) {
    return {
      success: false,
      error: executionDecision.reason,
    };
  }

  const tx = executionDecision.tx as SearchGMPResponseData;

  // Extract relevant data from the transaction
  const {
    destinationContractAddress,
    destinationChain,
    amount,
    payload,
    symbol,
  } = tx.call.returnValues;

  // Get the wallet client for the destination chain
  const destWallet = await getDestWalletClient(
    axelarscanClient,
    destinationChain,
    rpcUrl,
    privateKey
  );

  // If we can't get a wallet client, return an error
  if (!destWallet) {
    return {
      success: false,
      error: "Cannot find rpcUrl for destination chain",
    };
  }

  // Determine if this is a contract call with token
  const isContractCallWithToken =
    executionDecision.tx?.call.event === "ContractCallWithToken";

  // Create a public client for the destination chain
  const publicClient = createPublicClient(
    destinationChain.toLowerCase() as SupportedMainnetChain
  );

  // Set up the contract instance
  const contract = getContract({
    address: destinationContractAddress as Hex,
    abi: parseAbi([
      "function execute(bytes32 commandId,string sourceChain,string sourceAddress,bytes payload) external nonpayable",
      "function executeWithToken(bytes32 commandId,string sourceChain,string sourceAddress,bytes payload,string tokenSymbol,uint256 amount) external nonpayable",
    ]),
    client: {
      publicClient,
      wallet: destWallet,
    },
  });

  try {
    let txHash: string = "";
    // Execute the appropriate function based on whether it's a contract call with token
    if (isContractCallWithToken && destWallet.account) {
      txHash = await contract.write.executeWithToken(
        [
          tx.command_id as Hex,
          tx.call.chain,
          tx.call.address as string,
          payload as Hex,
          symbol,
          BigInt(amount as unknown as string),
        ],
        {
          chain: publicClient.chain as Chain,
          account: destWallet.account.address,
        }
      );
    } else if (destWallet.account) {
      txHash = await contract.write.execute(
        [
          tx.command_id as Hex,
          tx.call.chain,
          tx.call.address as string,
          payload as Hex,
        ],
        {
          chain: publicClient.chain as Chain,
          account: destWallet.account.address,
        }
      );
    }

    // Return success result with transaction hash
    return {
      success: true,
      data: {
        txHash,
      },
    };
  } catch (e) {
    // Handle errors and return appropriate error message
    if (e instanceof Error) {
      return {
        success: false,
        error: e.message,
      };
    }

    return {
      success: false,
      error: "Unknown error",
    };
  }
}

async function shouldExecuteTransaction(
  srcTxHash: string,
  gmpClient: GMPClient,
  srcTxLogIndex?: number
): Promise<ExecutionDecision> {
  // Check if given tx needs to be executed

  const response = await gmpClient.searchGMP({
    txHash: srcTxHash as Hex,
    txLogIndex: srcTxLogIndex,
  });

  if (!response || response.length === 0) {
    return {
      needsExecution: false,
      reason: "Transaction not found",
    };
  }

  const tx = response[0];

  if (!tx?.approved) {
    return {
      needsExecution: false,
      reason: "Transaction not approved",
    };
  }

  if (tx?.executed) {
    return {
      needsExecution: false,
      reason: "Transaction already executed",
    };
  }

  return {
    needsExecution: true,
    tx,
  };
}

async function getDestWalletClient(
  axelarscanClient: AxelarscanClient,
  destChain: string,
  rpcUrl?: string | undefined,
  privateKey?: string | undefined
): Promise<WalletClient | undefined> {
  const chainConfigs = await axelarscanClient.getChainConfigs();
  const evmChainConfigs = chainConfigs.evm;
  const chainConfig = evmChainConfigs.find(
    (config) => config.id.toLowerCase() === destChain.toLowerCase()
  );

  // Use the public RPC endpoint if it is not provided in the chain config
  const destChainRpcUrl = chainConfig?.endpoints?.rpc?.[0] || rpcUrl;

  if (!destChainRpcUrl || !chainConfig) {
    return undefined;
  }
  const walletClient = getWalletClient(destChainRpcUrl, privateKey);

  return walletClient;
}
