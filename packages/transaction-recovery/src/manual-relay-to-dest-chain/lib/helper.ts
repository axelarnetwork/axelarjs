import {
  BaseChainConfigsResponse,
  CosmosChainConfig,
  EVMChainConfig,
  SearchGMPResponse,
} from "@axelarjs/api";

import { ManualRelayToDestChainError } from "../error";
import { RouteDir } from "../types";

export function getRouteDir(
  srcChain: EVMChainConfig | CosmosChainConfig,
  destChain: EVMChainConfig | CosmosChainConfig
) {
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

export function findChainConfig(
  chainConfigs: BaseChainConfigsResponse,
  chain: string
) {
  const allChainConfigs = [...chainConfigs.evm, ...chainConfigs.cosmos];
  const chainConfig = allChainConfigs.find(
    (config) => config.id.toLowerCase() === chain.toLowerCase()
  );
  return chainConfig;
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
