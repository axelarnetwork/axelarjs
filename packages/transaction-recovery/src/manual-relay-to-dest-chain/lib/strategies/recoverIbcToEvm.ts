import {
  sendAxelarRouteMessageTx,
  sendAxelarSignTx,
  sendEvmGatewayApproveTx,
  shouldAbortRecovery,
  type RecoveryDependencies,
  type RecoveryParams,
} from "..";

export async function recoverIbcToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  if (
    shouldAbortRecovery(routeMessageTxResponse) ||
    params.escapeAfterConfirm
  ) {
    return [routeMessageTxResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (shouldAbortRecovery(signTxResponse)) {
    return [routeMessageTxResponse, signTxResponse];
  }

  const gatewayApproveResponse = await sendEvmGatewayApproveTx(params, deps);

  return [routeMessageTxResponse, signTxResponse, gatewayApproveResponse];
}
