import { waitForDepositAddress } from "./helpers";

export type SendOptions = {};

async function getDepositAddress(sendOptions: SendOptions) {
  //invoke api to retrieve deposit address

  //wait for deposit address
  const depositAddress = await waitForDepositAddress();
  return {
    depositAddress,
    sendOptions,
  };
}

export default getDepositAddress;
