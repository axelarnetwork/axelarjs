import type {
  AxelarConfigClient,
  AxelarRecoveryApiClient,
  AxelarscanClient,
  BaseChainConfigsResponse,
  GMPClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import { createAxelarRPCQueryClient } from "@axelarjs/cosmos";

import { ManualRelayToDestChainError } from "./error";
import {
  findChainConfig,
  getRouteDir,
  isAlreadyExecuted,
  mapSearchGMPResponse,
} from "./lib/helper";
import {
  recoverEvmToEvm,
  recoverEvmToIbc,
  recoverIbcToEvm,
  recoverIbcToIbc,
  type RecoveryDependencies,
  type RecoveryParams,
} from "./lib/recovery";
import {
  ManualRelayToDestChainParams,
  RouteDir,
  type RecoveryTxResponse,
} from "./types";

export type ManualRelayToDestChainDependencies = {
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
  gmpClient: GMPClient;
};

export async function manualRelayToDestChain(
  params: ManualRelayToDestChainParams,
  dependencies: ManualRelayToDestChainDependencies
) {
  const { environment, txHash } = params;
  // const { txEventIndex, txLogIndex, messageId } = options;
  const { axelarscanClient, gmpClient } = dependencies;

  // Fetch external calls
  const calls = [
    gmpClient.searchGMP({ txHash }),
    axelarscanClient.getChainConfigs(),
  ];
  const resolvedCalls = await Promise.all(calls);

  const searchGMPResponse =
    resolvedCalls[0] as unknown as SearchGMPResponseData[];

  const gmpData = searchGMPResponse[0];

  if (!gmpData) {
    throw ManualRelayToDestChainError.TX_NOT_FOUND;
  }

  if (isAlreadyExecuted(gmpData.status)) {
    throw ManualRelayToDestChainError.TX_ALREADY_EXECUTED;
  }

  const { destChain, srcChain } = mapSearchGMPResponse(gmpData);

  // Get chains info
  const chainConfigs = resolvedCalls[1] as unknown as BaseChainConfigsResponse;
  const srcChainConfig = findChainConfig(chainConfigs, srcChain);
  const destChainConfig = findChainConfig(chainConfigs, destChain);

  if (!srcChainConfig || !destChainConfig) {
    throw ManualRelayToDestChainError.CHAIN_NOT_FOUND;
  }

  // Find route direction depends on chain configs
  const dir = getRouteDir(srcChainConfig, destChainConfig);
  const axelarQueryRpcClient = await createAxelarRPCQueryClient({
    environment,
  });

  const recoveryDeps: RecoveryDependencies = {
    ...dependencies,
    axelarQueryRpcClient,
  };
  const recoveryParams: RecoveryParams = {
    searchGMPData: gmpData,
    escapeAfterConfirm: params.options?.escapeAfterConfirm,
    srcChainConfig,
    destChainConfig,
  };

  let recoverySteps: RecoveryTxResponse[];

  if (dir === RouteDir.EVM_TO_EVM) {
    recoverySteps = await recoverEvmToEvm(recoveryParams, recoveryDeps);
  } else if (dir === RouteDir.COSMOS_TO_EVM) {
    recoverySteps = await recoverIbcToEvm(recoveryParams, recoveryDeps);
  } else if (dir === RouteDir.EVM_TO_COSMOS) {
    recoverySteps = await recoverEvmToIbc(recoveryParams, recoveryDeps);
  } else {
    recoverySteps = await recoverIbcToIbc(recoveryParams, recoveryDeps);
  }

  return {
    type: dir,
    recoverySteps,
  };
}
