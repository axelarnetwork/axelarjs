import { AxelarConfigsResponse } from "@axelarjs/api";
import { AXELAR_RPC_URLS_FALLBACK, Environment } from "@axelarjs/core";
import { createAxelarQueryClientWithFallback } from "@axelarjs/cosmos";
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
  let rpcUrls = AXELAR_RPC_URLS_FALLBACK.testnet as unknown as string[];
  if (requestConfig?.axelarRpcUrl) {
    rpcUrls = [
      requestConfig.axelarRpcUrl,
      ...AXELAR_RPC_URLS_FALLBACK[environment],
    ];
  }

  const axelarQueryClient = await createAxelarQueryClientWithFallback(rpcUrls);

  return axelarQueryClient.nexus
    .chains({ status: ChainStatus.CHAIN_STATUS_ACTIVATED })
    .then(({ chains }) => chains.map((chain) => chain.toLowerCase()));
}
