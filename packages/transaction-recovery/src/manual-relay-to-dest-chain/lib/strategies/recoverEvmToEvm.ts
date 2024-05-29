import {
  sendAxelarSignTx,
  sendEvmGatewayApproveTx,
  type RecoveryDependencies,
  type RecoveryParams,
} from "..";
import { sendAxelarConfirmTx } from "../AxelarConfirmTx";

export async function recoverEvmToEvm(
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

  const signResponse = await sendAxelarSignTx(params, deps);

  if (signResponse.skip && signResponse.error) {
    return [confirmResponse, signResponse];
  }

  const sendEvmGatewayResponse = await sendEvmGatewayApproveTx(params, deps);

  return [confirmResponse, signResponse, sendEvmGatewayResponse];
}
