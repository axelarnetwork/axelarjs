import { DEPOSIT_SERVICE_API_URLS, type Environment } from "@axelarjs/core";
import { HttpClient, HttpClientOptions } from "@axelarjs/utils/http-client";

import { DepositServiceClient } from "./isomorphic";

export const createDepositServiceApiClient = (
  env: Environment,
  options?: HttpClientOptions,
) =>
  DepositServiceClient.init({
    instance: HttpClient.extend({
      ...(options ?? {
        prefixUrl: DEPOSIT_SERVICE_API_URLS[env],
      }),
    }),
  });
