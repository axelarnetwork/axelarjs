import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  AxelarscanClient,
  GMPClient,
} from "@axelarjs/api";

import { ManualRelayToDestChainError } from "./error";
import {
  findChainConfig,
  getRouteDir,
  mapSearchGMPResponse,
} from "./lib/helper";
import { ManualRelayToDestChainParams } from "./types";

export type ManualRelayToDestChainDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  gmpClient: GMPClient;
};

export async function manualRelayToDestChain(
  params: ManualRelayToDestChainParams,
  dependencies: ManualRelayToDestChainDependencies
) {
  // 1. Query Transaction Status
  // 2. Map the respoonse to get srcChain, destChain, eventIndex, srcChainInfo, destChainInfo, routeDir, evm wallet
  // 3. Recover Tx by different routes:
  // 3.1 EVM -> EVM
  // 3.2 EVM -> IBC
  // 3.3 IBC -> EVM

  const { environment, txHash, options } = params;
  // const { txEventIndex, txLogIndex, messageId } = options;
  const { axelarscanClient, gmpClient } = dependencies;

  console.log(environment, options);

  const response = await gmpClient.searchGMP({
    txHash,
  });

  const { destChain, srcChain } = mapSearchGMPResponse(response);
  const chainConfigs = await axelarscanClient.getChainConfigs();
  const srcChainInfo = findChainConfig(chainConfigs, srcChain);
  const destChainInfo = findChainConfig(chainConfigs, destChain);

  if (!srcChainInfo || !destChainInfo) {
    throw ManualRelayToDestChainError.TX_NOT_FOUND;
  }

  const routeDir = getRouteDir(srcChainInfo, destChainInfo);

  console.log(routeDir);
}
