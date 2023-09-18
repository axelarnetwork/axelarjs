import { AxelarscanClient, LinkRequestResponse } from "@axelarjs/api";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";
import { type OTC } from "@axelarjs/api/deposit-address-api/types";

import { SendOptions } from "~/types";
import { isStrEqual, poll } from "./utils";
import { createWallet } from "./wallet";

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
  const wallet = await createWallet();
  const publicAddress = wallet.account.address;
  const { validationMsg } = await getOneTimeCode(
    publicAddress,
    depositAddressClient
  );
  console.log({ validationMsg, params });

  // then get signature, i.e. await signOTC...

  // then request the deposit address with these params:
  // const payload = {
  //   fromChain: sourceChain,
  //   toChain: destinationChain,
  //   destinationAddress,
  //   asset,
  //   publicAddress,
  //   signature,
  // };

  return {
    success: true,
    otherInfoTBD: ";-)",
  };
}
export async function getOneTimeCode(
  signerAddress: `0x${string}`,
  depositAddressClient: DepositAddressClient
): Promise<OTC> {
  console.log("getting one time code", signerAddress);
  const otc: OTC = await depositAddressClient.getOTC({ signerAddress });

  //why isn't this reaching?
  console.log({ otc });
  return otc;
}
