import { BaseChainConfigsResponse, SearchGMPResponse } from "@axelarjs/api";

import { ManualRelayToDestChainError } from "../error";
import { RouteDir, type RecoveryTxResponse } from "../types";

export function getRouteDir(srcChain: ChainConfig, destChain: ChainConfig) {
  if (srcChain.chain_type === "evm" && destChain.chain_type === "evm") {
    return RouteDir.EVM_TO_EVM;
  } else if (
    srcChain.chain_type === "evm" &&
    destChain.chain_type === "cosmos"
  ) {
    return RouteDir.EVM_TO_COSMOS;
  } else {
    return RouteDir.COSMOS_TO_EVM;
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

export function mapSearchGMPResponse(response: SearchGMPResponse["data"]) {
  const tx = response[0];

  if (!tx) {
    throw ManualRelayToDestChainError.TX_NOT_FOUND;
  }

  return {
    srcChain: tx.call.chain,
    destChain: tx.call.returnValues.destinationChain,
    eventIndex: tx.call._logIndex,
  };
}

export type RecoveryStep = Promise<RecoveryTxResponse>;

export async function retry(
  times: number = 10,
  delay: number = 3000,
  pendingRecoveryStep: RecoveryStep
) {
  let resolved;
  for (let i = 0; i < times; i++) {
    resolved = await pendingRecoveryStep;
    if (resolved.skip && !resolved.error) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
      return resolved;
    }
  }

  return {
    ...resolved,
    error: new Error("Max retries reached"),
  };
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
