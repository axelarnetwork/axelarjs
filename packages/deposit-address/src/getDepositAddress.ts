import { waitForDepositAddress } from "./helpers";

export type SendOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  module: string;
};

async function getDepositAddress({
  sourceChain,
  destinationAddress,
  destinationChain,
  asset,
  module,
}: SendOptions) {
  //invoke api to retrieve deposit address

  //wait for deposit address
  return waitForDepositAddress({
    sourceChain,
    destinationAddress,
    destinationChain,
    asset,
    module,
  });
}

export default getDepositAddress;
