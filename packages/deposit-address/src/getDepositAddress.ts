import {
  triggerGetDepositAddressFromAxelar,
  validateAddress,
  validateChainIds,
} from "./helpers";
import { SendOptions } from "./types";

async function getDepositAddress(params: SendOptions) {
  /**
   * input validation
   */
  validateAddress(params.destinationAddress);
  validateChainIds([params.sourceChain, params.destinationChain]);

  /**
   * invoke API to get deposit address
   */
  const waitForTrigger = await triggerGetDepositAddressFromAxelar(params);

  return "canh";

  /**
   * wait for and return deposit address
   */
  // return waitForDepositAddress(params);
}

export default getDepositAddress;
