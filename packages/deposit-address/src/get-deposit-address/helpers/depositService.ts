import { ChainConfigsResponse } from "@axelarjs/api";
import { AXELAR_RPC_URLS, Environment } from "@axelarjs/core";
import { createAxelarQueryClient } from "@axelarjs/cosmos";
import { ChainStatus } from "@axelarjs/proto/axelar/nexus/v1beta1/query";

export function unwrappable(
  destinationChain: string,
  asset: string,
  chainConfigs: ChainConfigsResponse
) {
  const destinationChainConfig =
    chainConfigs.chains[destinationChain.toLowerCase()];

  if (!destinationChainConfig) return false;

  const destAsset = destinationChainConfig.assets.find(
    ({ id }) => id === asset
  );

  return destAsset?.module === "evm" && destAsset.isERC20WrappedNativeGasToken;
}

export async function getActiveChains(environment: Environment) {
  const axelarQueryClient = await createAxelarQueryClient(
    AXELAR_RPC_URLS[environment]
  );

  return axelarQueryClient.nexus
    .chains({ status: ChainStatus.CHAIN_STATUS_ACTIVATED })
    .then(({ chains }) => chains.map((chain) => chain.toLowerCase()));
}
