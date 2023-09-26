import { GMP_API_URLS, type Environment } from "@axelarjs/core";

import { BaseHttpClient, BaseHttpClientOptions } from "../baseHTTPClient";
import { GMPClient } from "./isomorphic";

export const createGMPClient = (
  env: Environment,
  options?: BaseHttpClientOptions
) =>
  GMPClient.init({
    instance: BaseHttpClient.extend({
      ...(options ?? {
        prefixUrl: GMP_API_URLS[env],
      }),
    }),
  });
