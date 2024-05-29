import {
  sendAxelarRouteMessageTx,
  sendAxelarSignTx,
  type RecoveryDependencies,
  type RecoveryParams,
} from "..";
import { sendAxelarConfirmTx } from "../AxelarConfirmTx";

export async function recoverEvmToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const confirmResponse = await sendAxelarConfirmTx(params, deps);

  if (
    (confirmResponse.skip && confirmResponse.error) ||
    params.escapeAfterConfirm
  ) {
    return [confirmResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (signTxResponse.skip && signTxResponse.error) {
    return [confirmResponse, signTxResponse];
  }

  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  return [confirmResponse, signTxResponse, routeMessageTxResponse];
}
