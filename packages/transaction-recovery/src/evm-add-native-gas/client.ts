import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp/";
import { ENVIRONMENTS } from "@axelarjs/core";
import {
  createPublicClient,
  createPublicTestnetClient,
  SupportedMainnetChain,
  SupportedTestnetChain,
} from "@axelarjs/evm";

import type { EvmAddNativeGasParams } from "../types";
import { addNativeGas as baseAddNativeGas } from "./isomorphic";

export function evmAddNativeGas(params: EvmAddNativeGasParams) {
  const { environment } = params.evmSendOptions;

  return baseAddNativeGas(params, {
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    evmClient:
      environment === ENVIRONMENTS.mainnet
        ? createPublicClient(params.chain as SupportedMainnetChain)
        : createPublicTestnetClient(params.chain as SupportedTestnetChain),
  });
}

export default evmAddNativeGas;
