import type { SearchGMPResponseData } from "@axelarjs/api";
import { type AxelarQueryClientService } from "@axelarjs/cosmos";

import {
  sendAxelarConfirmTx,
  sendAxelarRouteMessageTx,
  sendAxelarSignTx,
  sendEvmGatewayApproveTx,
} from ".";
import type { ManualRelayToDestChainDependencies } from "../isomorphic";
import { type ChainConfig } from "../lib/helper";

export type RecoveryDependencies = ManualRelayToDestChainDependencies & {
  axelarQueryRpcClient: AxelarQueryClientService;
};

export type RecoveryParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
  destChainConfig: ChainConfig;
  escapeAfterConfirm?: boolean | undefined;
};

export async function recoverEvmToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const confirmResponse = await sendAxelarConfirmTx(params, deps);

  if (confirmResponse.skip || params.escapeAfterConfirm) {
    return [confirmResponse];
  }

  const signResponse = await sendAxelarSignTx(params, deps);

  if (signResponse.skip) {
    return [confirmResponse, signResponse];
  }

  const sendEvmGatewayResponse = await sendEvmGatewayApproveTx(params, deps);

  return [confirmResponse, signResponse, sendEvmGatewayResponse];
}

export async function recoverEvmToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const confirmResponse = await sendAxelarConfirmTx(params, deps);

  if (confirmResponse.skip || params.escapeAfterConfirm) {
    return [confirmResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (signTxResponse.skip) {
    return [confirmResponse, signTxResponse];
  }

  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  return [confirmResponse, signTxResponse, routeMessageTxResponse];
}

export async function recoverIbcToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  if (routeMessageTxResponse.skip || params.escapeAfterConfirm) {
    return [routeMessageTxResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (signTxResponse.skip) {
    return [routeMessageTxResponse, signTxResponse];
  }

  const gatewayApproveResponse = await sendEvmGatewayApproveTx(params, deps);

  return [routeMessageTxResponse, signTxResponse, gatewayApproveResponse];
}

export async function recoverIbcToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);
  return [routeMessageTxResponse];
}
