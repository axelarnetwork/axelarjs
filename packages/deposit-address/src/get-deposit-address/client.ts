import { createDepositServiceApiClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarscanClient } from "@axelarjs/api/axelarscan";
import { createDepositAddressApiClient } from "@axelarjs/api/deposit-address";
import { createGMPClient } from "@axelarjs/api/gmp";

import {
  getDepositAddress as baseGetDepositAddress,
  getNativeWrapDepositAddress as baseGetNativeDepositAddress,
  getNativeUnwrapDepositAddress as baseGetNativeUnwrapDepositAddress,
} from "./isomorphic";
import type {
  DepositNativeUnwrapOptions,
  DepositNativeWrapOptions,
  SendOptions,
} from "./types";

export function getDepositAddress(params: SendOptions) {
  const { environment } = params;

  return baseGetDepositAddress(params, {
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    depositAddressClient: createDepositAddressApiClient(environment),
    axelarscanClient: createAxelarscanClient(environment),
  });
}

export function getNativeWrapDepositAddress(params: DepositNativeWrapOptions) {
  const { environment } = params;

  return baseGetNativeDepositAddress(params, {
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    depositServiceClient: createDepositServiceApiClient(environment),
  });
}

export function getNativeUnwrapDepositAddress(
  params: DepositNativeUnwrapOptions
) {
  const { environment } = params;

  return baseGetNativeUnwrapDepositAddress(params, {
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    depositServiceClient: createDepositServiceApiClient(environment),
  });
}

export default getDepositAddress;
