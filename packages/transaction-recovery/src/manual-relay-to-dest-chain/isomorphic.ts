import type {
  AxelarConfigClient,
  AxelarRecoveryApiClient,
  AxelarscanClient,
  BaseChainConfigsResponse,
  GMPClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import {
  createAxelarRPCQueryClient,
  type AxelarQueryClientService,
} from "@axelarjs/cosmos";

import { ManualRelayToDestChainError } from "./error";
import {
  findChainConfig,
  getRouteDir,
  mapSearchGMPResponse,
  type ChainConfig,
} from "./lib/helper";
import { sendAxelarConfirmTx } from "./sendAxelarConfirmTx";
import { sendAxelarRouteMessageTx } from "./sendAxelarRouteMessageTx";
import { sendAxelarSignTx } from "./sendAxelarSignTx";
import { sendEvmGatewayApproveTx } from "./sendEvmGatewayApproveTx";
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

export type RecoveryDependencies = ManualRelayToDestChainDependencies & {
  axelarQueryRpcClient: AxelarQueryClientService;
};

export type RecoveryParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
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

  if (!searchGMPResponse[0]) {
    throw ManualRelayToDestChainError.TX_NOT_FOUND;
  }

  const chainConfigs = resolvedCalls[1] as unknown as BaseChainConfigsResponse;

  const { destChain, srcChain } = mapSearchGMPResponse(searchGMPResponse);

  // Get chains info
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
    searchGMPData: searchGMPResponse[0],
    srcChainConfig,
  };

  let recoveryResponse: RecoveryTxResponse[];

  if (dir === RouteDir.EVM_TO_EVM) {
    recoveryResponse = await recoverEvmToEvm(recoveryParams, recoveryDeps);
  } else if (dir === RouteDir.COSMOS_TO_EVM) {
    recoveryResponse = await recoverEvmToIbc(recoveryParams, recoveryDeps);
  } else if (dir === RouteDir.EVM_TO_COSMOS) {
    recoveryResponse = await recoverIbcToEvm(recoveryParams, recoveryDeps);
  } else {
    recoveryResponse = await recoverIbcToIbc(recoveryParams, recoveryDeps);
  }

  console.log(recoveryResponse);
}

async function recoverEvmToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  console.log(params.searchGMPData.command_id);
  const confirmResponse = await sendAxelarConfirmTx(params, deps);
  const signResponse = await sendAxelarSignTx(params, deps);
  await sendEvmGatewayApproveTx(params, deps);

  console.log("confirmResponse", confirmResponse);
  console.log("signResponse", signResponse);
  return [confirmResponse, signResponse];
}

async function recoverEvmToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  await sendAxelarConfirmTx(params, deps);
  await sendAxelarSignTx(params, deps);
  await sendAxelarRouteMessageTx(params, deps);
}

async function recoverIbcToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  await sendAxelarRouteMessageTx(params, deps);
  await sendAxelarSignTx(params, deps);
  await sendEvmGatewayApproveTx(params, deps);
}

async function recoverIbcToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  await sendAxelarRouteMessageTx(params, deps);
}
