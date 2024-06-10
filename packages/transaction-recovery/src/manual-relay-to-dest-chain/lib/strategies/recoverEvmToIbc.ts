import {
  sendAxelarRouteMessageTx,
  sendAxelarSignTx,
  shouldAbortRecovery,
  type RecoveryDependencies,
  type RecoveryParams,
} from "..";
import { sendAxelarConfirmTx } from "../AxelarConfirmTx";

export async function recoverEvmToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const confirmResponse = await sendAxelarConfirmTx(params, deps);

  if (shouldAbortRecovery(confirmResponse) || params.escapeAfterConfirm) {
    return [confirmResponse];
  }

  const signTxResponse = await sendAxelarSignTx(params, deps);

  if (shouldAbortRecovery(signTxResponse)) {
    return [confirmResponse, signTxResponse];
  }

  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  return [confirmResponse, signTxResponse, routeMessageTxResponse];
}
