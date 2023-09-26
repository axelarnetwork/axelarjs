import { AXELARSCAN_API_URLS, type Environment } from "@axelarjs/core";

import { BaseHttpClient, type BaseHttpClientOptions } from "../baseHTTPClient";
import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanClient = (
  env: Environment,
  options?: BaseHttpClientOptions
) =>
  AxelarscanClient.init({
    instance: BaseHttpClient.extend({
      ...(options ?? {
        prefixUrl: AXELARSCAN_API_URLS[env],
      }),
    }),
  });
