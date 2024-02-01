import type { Environment } from "@axelarjs/core";
import {
  HttpClient,
  type HttpClientOptions,
} from "@axelarjs/utils/http-client";

import { createGMPClient } from "../gmp/client";
import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryClient = (
  env: Environment,
  options?: HttpClientOptions
) =>
  AxelarQueryAPIClient.init(
    {
      instance: HttpClient.extend(options ?? {}),
    },
    {
      gmpClient: createGMPClient(env),
    },
    env
  );
