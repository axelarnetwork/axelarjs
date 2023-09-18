import {
  createAxelarQueryNodeClient,
  createConfigNodeClient,
  createGMPNodeClient,
} from "@axelarjs/api";

import { SigningStargateClient } from "@cosmjs/stargate";

import { AddGasParams } from "~/types";
import { addGas } from "./addGas";

export default function addGasNode(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return addGas(params, {
    axelarQueryClient: createAxelarQueryNodeClient(environment, {}),
    configClient: createConfigNodeClient(environment),
    gmpClient: createGMPNodeClient(environment),
    getSigningStargateClient: SigningStargateClient.connectWithSigner,
  });
}
