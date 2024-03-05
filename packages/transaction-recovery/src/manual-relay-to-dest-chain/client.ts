import { createAxelarscanClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";

import { manualRelayToDestChain as baseManualRelayToDestChain } from "./isomorphic";
import type { ManualRelayToDestChainParams } from "./types";

export function manualRelayToDestChain(params: ManualRelayToDestChainParams) {
  const { environment } = params;

  return baseManualRelayToDestChain(params, {
    axelarscanClient: createAxelarscanClient(environment),
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  });
}

export default manualRelayToDestChain;
