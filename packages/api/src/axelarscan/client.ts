import { AXELARSCAN_API_URLS, type Environment } from "@axelarjs/core";
import {
  HttpClient,
  type HttpClientOptions,
} from "@axelarjs/utils/http-client";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanClient = (
  env: Environment,
  options?: HttpClientOptions,
) =>
  AxelarscanClient.init({
    instance: HttpClient.extend({
      ...(options ?? {
        prefixUrl: AXELARSCAN_API_URLS[env],
      }),
    }),
  });
