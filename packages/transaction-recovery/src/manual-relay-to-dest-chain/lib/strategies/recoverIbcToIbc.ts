import type { RecoveryDependencies, RecoveryParams } from "..";
import { sendAxelarRouteMessageTx } from "../AxelarRouteMessageTx";

export async function recoverIbcToIbc(
  params: RecoveryParams,
  deps: RecoveryDependencies
) {
  const routeMessageTxResponse = await sendAxelarRouteMessageTx(params, deps);
  return [routeMessageTxResponse];
}
