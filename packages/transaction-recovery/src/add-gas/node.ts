import { createAxelarConfigNodeClient } from "@axelarjs/api/axelar-config/node";
import { createAxelarQueryNodeClient } from "@axelarjs/api/axelar-query/node";
import { createGMPNodeClient } from "@axelarjs/api/gmp/node";

import { SigningStargateClient } from "@cosmjs/stargate";

import { AddGasParams } from "~/types";
import { addGas } from "./addGas";

export default function addGasNode(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return addGas(params, {
    axelarQueryClient: createAxelarQueryNodeClient(environment, {}),
    configClient: createAxelarConfigNodeClient(environment),
    gmpClient: createGMPNodeClient(environment),
    getSigningStargateClient: SigningStargateClient.connectWithSigner,
  });
}
