import type {
  AxelarscanClient,
  ChainConfigsResponse,
  DepositAddressClient,
  LinkRequestResponse,
} from "@axelarjs/api";
import { caseInsensitiveEqual, poll } from "@axelarjs/utils";

import type { GetDepositAddressDependencies, SendOptions } from "../types";
import { createDummyAccount, signOtc } from "./account";

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
  const response = await triggerGetDepositAddressFromAxelar(
    params,
    dependencies.depositAddressClient
  );

  if (!response.data) {
    throw new Error("No data returned from deposit address API");
  }

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
  return results.find((linkRequest) => {
    const matchesBaseConditions = [
      [linkRequest.module, module], // matches module
      [linkRequest.destinationAddress, params.destinationAddress], // matches destination address
      [linkRequest.destinationChain, params.destinationChain], // matches destination chain
      [linkRequest.asset, params.asset], // matches asset
    ].every(([a, b]) => caseInsensitiveEqual(a, b));

    switch (module) {
      case "axelarnet":
        return matchesBaseConditions;
      case "evm":
        return (
          matchesBaseConditions &&
          // matches source chain
          caseInsensitiveEqual(linkRequest.sourceChain, params.sourceChain)
        );
      default:
        // invalid module
        return false;
    }
  });
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
) {
  const account = createDummyAccount();
  const publicAddress = account.address;
  const { validationMsg } = await depositAddressClient.getOTC({
    signerAddress: publicAddress,
  });

  const signature = await signOtc(account, validationMsg);

  return depositAddressClient.requestDepositAddress({
    fromChain: params.sourceChain,
    toChain: params.destinationChain,
    destinationAddress: params.destinationAddress,
    asset: params.asset,
    publicAddress,
    signature,
  });
}
