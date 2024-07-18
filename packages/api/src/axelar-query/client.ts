import type { Environment } from "@axelarjs/core";
import {
  HttpClient,
  type HttpClientOptions,
} from "@axelarjs/utils/http-client";

import { createAxelarConfigClient } from "../axelar-config";
import { createAxelarscanClient } from "../axelarscan";
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
      axelarscanClient: createAxelarscanClient(env),
      axelarConfigClient: createAxelarConfigClient(env),
    },
    env
  );
