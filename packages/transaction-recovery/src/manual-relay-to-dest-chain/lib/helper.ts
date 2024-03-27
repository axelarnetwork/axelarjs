import { BaseChainConfigsResponse, SearchGMPResponse } from "@axelarjs/api";

import { ManualRelayToDestChainError } from "../error";
import { RouteDir } from "../types";

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
