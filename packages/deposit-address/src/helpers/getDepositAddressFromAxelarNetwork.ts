import type {
  AxelarscanClient,
  ChainConfigsResponse,
  LinkRequestResponse,
} from "@axelarjs/api";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";
import type {
  DepositAddressResponse,
  GetDepositAddressParams,
  OTC,
} from "@axelarjs/api/deposit-address-api/types";

import type { GetDepositAddressDependencies, SendOptions } from "~/types";
import { createDummyAccount, signOtc } from "./account";
import { isStrEqual, poll } from "./utils";

export type ListenerParams = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
};

export async function getDepositAddressFromAxelarNetwork(
  params: SendOptions,
  chainConfigs: ChainConfigsResponse,
  dependencies: GetDepositAddressDependencies
) {
  /**
   * invoke API to get deposit address
   */
  await triggerGetDepositAddressFromAxelar(
    params,
    dependencies.depositAddressClient
  );
  /**
   * wait for and return deposit address
   */
  return waitForDepositAddress(
    params,
    chainConfigs,
    dependencies.axelarscanClient
  );
}

function findLinkRequest(
  params: ListenerParams,
  module: "evm" | "axelarnet" | undefined,
  results: LinkRequestResponse[]
) {
  const foundEntry = results.find(
    (linkRequest) =>
      module === "axelarnet" ||
      (isStrEqual(linkRequest.sourceChain, params.sourceChain) &&
        isStrEqual(linkRequest.destinationAddress, params.destinationAddress) &&
        isStrEqual(linkRequest.destinationChain, params.destinationChain) &&
        isStrEqual(linkRequest.asset, params.asset))
  );
  return foundEntry;
}

async function waitForDepositAddress(
  params: ListenerParams,
  chainConfigs: ChainConfigsResponse,
  axelarscanClient: AxelarscanClient
) {
  const srcChainConfig = chainConfigs.chains[params.sourceChain.toLowerCase()];
  return findLinkRequest(
    params,
    srcChainConfig?.module,
    await poll(
      () => axelarscanClient.getRecentLinkTransactions({ size: 10 }),
      (res: LinkRequestResponse[]) =>
        !findLinkRequest(params, srcChainConfig?.module, res),
      5_000,
      5
    )
  );
}

async function triggerGetDepositAddressFromAxelar(
  params: SendOptions,
  depositAddressClient: DepositAddressClient
): Promise<any> {
  const account = await createDummyAccount();
  const publicAddress = account.address;
  const { validationMsg } = await getOneTimeCode(
    publicAddress,
    depositAddressClient
  );
  return await requestDepositAddress(
    {
      fromChain: params.sourceChain,
      toChain: params.destinationChain,
      destinationAddress: params.destinationAddress,
      asset: params.asset,
      publicAddress,
      signature: await signOtc(account, validationMsg),
    },
    depositAddressClient
  );
}
async function getOneTimeCode(
  signerAddress: `0x${string}`,
  depositAddressClient: DepositAddressClient
): Promise<OTC> {
  return depositAddressClient.getOTC({ signerAddress });
}

async function requestDepositAddress(
  params: GetDepositAddressParams,
  depositAddressClient: DepositAddressClient
): Promise<DepositAddressResponse> {
  return depositAddressClient.requestDepositAddress(params);
}
