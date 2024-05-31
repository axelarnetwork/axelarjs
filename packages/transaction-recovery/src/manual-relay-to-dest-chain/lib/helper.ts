import {
  BaseChainConfigsResponse,
  type SearchGMPResponseData,
} from "@axelarjs/api";

import { RouteDir, type RecoveryTxResponse } from "../types";

export function getRouteDir(srcChain: ChainConfig, destChain: ChainConfig) {
  if (srcChain.chain_type === "evm" && destChain.chain_type === "evm") {
    return RouteDir.EVM_TO_EVM;
  } else if (
    srcChain.chain_type === "evm" &&
    destChain.chain_type === "cosmos"
  ) {
    return RouteDir.EVM_TO_COSMOS;
  } else if (
    srcChain.chain_type === "cosmos" &&
    destChain.chain_type === "evm"
  ) {
    return RouteDir.COSMOS_TO_EVM;
  } else {
    return RouteDir.COSMOS_TO_COSMOS;
  }
}

export type ChainConfig = {
  chain_type: "evm" | "cosmos";
  id: string;
  name: string;
  rpcUrl?: string | undefined;
};

export function findChainConfig(
  chainConfigs: BaseChainConfigsResponse,
  chain: string
): ChainConfig | undefined {
  const evmChainConfig = chainConfigs.evm.find(
    (config) => config.id.toLowerCase() === chain.toLowerCase()
  );

  if (evmChainConfig) {
    return {
      chain_type: "evm",
      id: evmChainConfig.id,
      rpcUrl: evmChainConfig.endpoints?.rpc?.[0],
      name: evmChainConfig.name,
    };
  }

  const cosmosChainConfig = chainConfigs.cosmos.find(
    (config) => config.id.toLowerCase() === chain.toLowerCase()
  );

  if (cosmosChainConfig) {
    return {
      chain_type: "cosmos",
      id: cosmosChainConfig.id,
      name: cosmosChainConfig.name,
    };
  }

  return undefined;
}

export function isAlreadyExecuted(status: string) {
  const executedStatuses = ["executed", "approved", "error"];
  return executedStatuses.includes(status);
}

export function mapSearchGMPResponse(tx: SearchGMPResponseData) {
  return {
    srcChain: tx.call.chain,
    destChain: tx.call.returnValues.destinationChain,
    eventIndex: tx.call._logIndex,
  };
}

export type RecoveryStep = Promise<RecoveryTxResponse>;

export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  delay = 5000
): Promise<T> {
  let error: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      error = e;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw error;
}

export async function processRecovery(pendingRecoverySteps: RecoveryStep[]) {
  const responses = [];
  for (const pendingRecoveryStep of pendingRecoverySteps) {
    const response = await pendingRecoveryStep;

    if (response.skip && !response.error) {
      // retry if not error
    }

    responses.push(response);
  }

  return responses;
}
