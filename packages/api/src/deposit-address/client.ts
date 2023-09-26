import { DEPOSIT_ADDRESS_API_URLS, type Environment } from "@axelarjs/core";

import { BaseHttpClient, BaseHttpClientOptions } from "../baseHTTPClient";
import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiClient = (
  env: Environment,
  options?: BaseHttpClientOptions
) =>
  DepositAddressClient.init({
    instance: BaseHttpClient.extend({
      ...(options ?? {
        prefixUrl: DEPOSIT_ADDRESS_API_URLS[env],
      }),
    }),
  });
