import {
  sendAxelarRouteMessageTx,
  sendAxelarSignTx,
  sendEvmGatewayApproveTx,
  type RecoveryDependencies,
  type RecoveryParams,
} from "..";

export async function recoverIbcToEvm(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  if (
    (routeMessageTxResponse.skip && routeMessageTxResponse.error) ||
    params.escapeAfterConfirm
  ) {
    return [routeMessageTxResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (signTxResponse.skip && signTxResponse.error) {
    return [routeMessageTxResponse, signTxResponse];
  }

  const gatewayApproveResponse = await sendEvmGatewayApproveTx(params, deps);

  return [routeMessageTxResponse, signTxResponse, gatewayApproveResponse];
}
