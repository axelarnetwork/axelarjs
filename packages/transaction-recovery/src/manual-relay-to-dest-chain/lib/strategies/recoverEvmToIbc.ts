import {
  sendAxelarRouteMessageTx,
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

  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);

  return [confirmResponse, routeMessageTxResponse];
}
