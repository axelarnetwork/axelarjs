import { AxelarscanClient, LinkRequestResponse } from "@axelarjs/api";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";
import { type OTC } from "@axelarjs/api/deposit-address-api/types";

import { signMessage } from "viem/accounts";

import { SendOptions } from "~/types";
import { isStrEqual, poll } from "./utils";
import { createDummyAccount, signOtc } from "./wallet";

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
  console.log({ validationMsg, signature, publicAddress });

  const payload = {
    fromChain: params.sourceChain,
    toChain: params.destinationChain,
    destinationAddress: params.destinationAddress,
    asset: params.asset,
    publicAddress,
    signature,
  };

  return {
    success: true,
    otherInfoTBD: ";-)",
  };
}
export async function getOneTimeCode(
  signerAddress: `0x${string}`,
  depositAddressClient: DepositAddressClient
): Promise<OTC> {
  return depositAddressClient.getOTC({ signerAddress });
}
