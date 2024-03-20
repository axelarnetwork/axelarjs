import { GMP_API_URLS, type Environment } from "@axelarjs/core";
import { HttpClient, HttpClientOptions } from "@axelarjs/utils/http-client";

import { GMPClient } from "./isomorphic";

export const createGMPClient = (
  env: Environment,
  options?: HttpClientOptions
) =>
  GMPClient.init({
    instance: HttpClient.extend({
      ...(options ?? {
        prefixUrl: GMP_API_URLS[env],
      }),
    }),
  });
