import { DEPOSIT_ADDRESS_API_URLS, type Environment } from "@axelarjs/core";
import { HttpClient, HttpClientOptions } from "@axelarjs/utils/http-client";

import { DepositAddressClient } from "./isomorphic";

export const createDepositAddressApiClient = (
  env: Environment,
  options?: HttpClientOptions,
) =>
  DepositAddressClient.init({
    instance: HttpClient.extend({
      ...(options ?? {
        prefixUrl: DEPOSIT_ADDRESS_API_URLS[env],
      }),
    }),
  });
