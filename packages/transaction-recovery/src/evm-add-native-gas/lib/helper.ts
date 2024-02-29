import { AxelarConfigClient, AxelarEVMChainConfig } from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

export async function getGasServiceAddressFromChainConfig(
  chainConfig: AxelarConfigClient,
  env: Environment,
  chain: string
) {
  const _chainConfigs = await chainConfig.getChainConfigs(env);
  const mapEvmChains = Object.entries(_chainConfigs.chains)
    .filter(([, v]) => {
      return v.module === "evm";
    })
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});

  const srcChainConfig = mapEvmChains[
    chain.toLowerCase()
  ] as AxelarEVMChainConfig;

  return srcChainConfig.evmConfigs.contracts.gasService;
}
