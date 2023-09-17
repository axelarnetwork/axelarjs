import { LinkRequestResponse } from "@axelarjs/api";
import { createAxelarscanNodeClient } from "@axelarjs/api/axelarscan/node";

import { SendOptions } from "~/types";
import { isStrEqual, poll } from "./utils";
import { createWallet, signOtc } from "./wallet";

export type ListenerParams = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  module: string;
};

const findLinkRequest = (
  params: ListenerParams,
  results: LinkRequestResponse[]
) => {
  const foundEntry = results.find(
    (linkRequest) =>
      params.module === "axelarnet" ||
      (isStrEqual(linkRequest.sourceChain, params.sourceChain) &&
        isStrEqual(linkRequest.destinationAddress, params.destinationAddress) &&
        isStrEqual(linkRequest.destinationChain, params.destinationChain) &&
        isStrEqual(linkRequest.asset, params.asset))
  );
  return foundEntry;
};

export async function waitForDepositAddress(params: ListenerParams) {
  const apiClient = createAxelarscanNodeClient({
    prefixUrl: "https://testnet.api.axelarscan.io",
  });

  return findLinkRequest(
    params,
    await poll(
      () => apiClient.getRecentLinkTransactions({ size: 10 }),
      (res: LinkRequestResponse[]) => !findLinkRequest(params, res),
      5_000,
      5
    )
  );
}

export async function triggerGetDepositAddressFromAxelar({
  sourceChain,
  destinationAddress,
  destinationChain,
  asset,
}: SendOptions): Promise<string> {
  type RoomIdResponse = Record<"data", Record<"roomId", string>>;

  const wallet = await createWallet();
  const publicAddress = wallet.account.address;
  const { validationMsg } = await getOneTimeCode(publicAddress);
  const signature = await signOtc(wallet, validationMsg);
  const payload = {
    fromChain: sourceChain,
    toChain: destinationChain,
    destinationAddress,
    asset,
    publicAddress,
    signature,
  };

  const response: RoomIdResponse = await this.api
    .post(CLIENT_API_POST_TRANSFER_ASSET, payload, traceId)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

  const roomId = response?.data?.roomId;
  return roomId;
}
async function getOneTimeCode(
  signerAddress: `0x${string}` | undefined
): Promise<OTC> {
  const otc: OTC = await this.api
    .get(`${CLIENT_API_GET_OTC}?publicAddress=${signerAddress}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

  return otc;
}
