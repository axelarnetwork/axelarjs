import { AxelarConfigsResponse } from "@axelarjs/api";
import { AXELAR_RPC_URLS, Environment } from "@axelarjs/core";
import { createAxelarQueryClient } from "@axelarjs/cosmos";
import { ChainStatus } from "@axelarjs/proto/axelar/nexus/v1beta1/query";

import { DepositAddressRequestConfig } from "../types";

export function unwrappable(
  destinationChain: string,
  asset: string,
  chainConfigs: AxelarConfigsResponse
): boolean {
  const destinationChainConfig =
    chainConfigs.chains[destinationChain.toLowerCase()];

  if (!destinationChainConfig) return false;

  const destAsset = Object.entries(chainConfigs.assets)
    .map((tuple) => tuple[1])
    .find(({ id }) => id === asset);

  const chainForDestAsset = Object.entries(destAsset?.chains ?? []).find(
    (tuple) => tuple[0] === destinationChain
  );

  if (chainForDestAsset) {
    return Boolean(chainForDestAsset[1]?.isERC20WrappedNativeGasToken);
  }
  return false;
}

export async function getActiveChains(
  environment: Environment,
  requestConfig?: DepositAddressRequestConfig
) {
  const axelarQueryClient = await createAxelarQueryClient(
    requestConfig?.axelarRpcUrl ?? AXELAR_RPC_URLS[environment]
  );

  return axelarQueryClient.nexus
    .chains({ status: ChainStatus.CHAIN_STATUS_ACTIVATED })
    .then(({ chains }) => chains.map((chain) => chain.toLowerCase()));
}
