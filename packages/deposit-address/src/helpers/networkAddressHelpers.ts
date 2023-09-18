import { AxelarscanClient, LinkRequestResponse } from "@axelarjs/api";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";
import type {
  DepositAddressResponse,
  GetDepositAddressParams,
  OTC,
} from "@axelarjs/api/deposit-address-api/types";

import { SendOptions } from "~/types";
import { createDummyAccount, signOtc } from "./account";
import { isStrEqual, poll } from "./utils";

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

export async function waitForDepositAddress(
  params: ListenerParams,
  axelarscanClient: AxelarscanClient
) {
  return findLinkRequest(
    params,
    await poll(
      () => axelarscanClient.getRecentLinkTransactions({ size: 10 }),
      (res: LinkRequestResponse[]) => !findLinkRequest(params, res),
      5_000,
      5
    )
  );
}

export async function triggerGetDepositAddressFromAxelar(
  params: SendOptions,
  depositAddressClient: DepositAddressClient
): Promise<any> {
  const account = await createDummyAccount();
  const publicAddress = account.address;
  const { validationMsg } = await getOneTimeCode(
    publicAddress,
    depositAddressClient
  );

  // then get signature, i.e. await signOTC...
  const signature = await signOtc(account, validationMsg);

  const payload = {
    fromChain: params.sourceChain,
    toChain: params.destinationChain,
    destinationAddress: params.destinationAddress,
    asset: params.asset,
    publicAddress,
    signature,
  };

  const depositAddressResponse = await requestDepositAddress(
    payload,
    depositAddressClient
  );

  return {
    success: true,
    depositAddressResponse,
  };
}
export async function getOneTimeCode(
  signerAddress: `0x${string}`,
  depositAddressClient: DepositAddressClient
): Promise<OTC> {
  return depositAddressClient.getOTC({ signerAddress });
}

export async function requestDepositAddress(
  params: GetDepositAddressParams,
  depositAddressClient: DepositAddressClient
): Promise<DepositAddressResponse> {
  return depositAddressClient.requestDepositAddress(params);
}
