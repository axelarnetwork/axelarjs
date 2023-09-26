import { AXELAR_CONFIG_API_URLS, type Environment } from "@axelarjs/core";

import { BaseHttpClient, type BaseHttpClientOptions } from "../baseHTTPClient";
import { AxelarConfigClient } from "./isomorphic";

export const createAxelarConfigClient = (
  env: Environment,
  options?: BaseHttpClientOptions
) =>
  AxelarConfigClient.init({
    instance: BaseHttpClient.extend({
      ...(options ?? {
        prefixUrl: AXELAR_CONFIG_API_URLS[env],
      }),
    }),
  });
