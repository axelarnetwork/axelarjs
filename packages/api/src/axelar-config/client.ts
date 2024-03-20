import { AXELAR_CONFIG_API_URLS, type Environment } from "@axelarjs/core";
import {
  HttpClient,
  type HttpClientOptions,
} from "@axelarjs/utils/http-client";

import { AxelarConfigClient } from "./isomorphic";

export const createAxelarConfigClient = (
  env: Environment,
  options?: HttpClientOptions
) =>
  AxelarConfigClient.init({
    instance: HttpClient.extend({
      ...(options ?? {
        prefixUrl: AXELAR_CONFIG_API_URLS[env],
      }),
    }),
  });
