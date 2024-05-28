import {
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
} from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createGMPClient } from "@axelarjs/api/gmp";

import { manualRelayToDestChain as baseManualRelayToDestChain } from "./isomorphic";
import type { ManualRelayToDestChainParams } from "./types";

export function manualRelayToDestChain(params: ManualRelayToDestChainParams) {
  const { environment } = params;

  return baseManualRelayToDestChain(
    {
      options: {},
      ...params,
    },
    {
      axelarscanClient: createAxelarscanClient(environment),
      axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
      configClient: createAxelarConfigClient(environment),
      gmpClient: createGMPClient(environment),
    }
  );
}

export default manualRelayToDestChain;
