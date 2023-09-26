import type { Environment } from "@axelarjs/core";

import { BaseHttpClient, type BaseHttpClientOptions } from "../baseHTTPClient";
import { createGMPClient } from "../gmp/client";
import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryClient = (
  env: Environment,
  options?: BaseHttpClientOptions
) =>
  AxelarQueryAPIClient.init(
    {
      instance: BaseHttpClient.extend(options ?? {}),
    },
    {
      gmpClient: createGMPClient(env),
    }
  );
