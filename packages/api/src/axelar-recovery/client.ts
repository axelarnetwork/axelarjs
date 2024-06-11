import { AXELAR_RECOVERY_API_URLS, type Environment } from "@axelarjs/core";
import {
  HttpClient,
  type HttpClientOptions,
} from "@axelarjs/utils/http-client";

import { createAxelarConfigClient } from "../axelar-config";
import { AxelarRecoveryApiClient } from "./isomorphic";

export const createAxelarRecoveryApiClient = (
  env: Environment,
  options?: HttpClientOptions
) =>
  AxelarRecoveryApiClient.init(
    {
      instance: HttpClient.extend({
        ...(options ?? {
          prefixUrl: AXELAR_RECOVERY_API_URLS[env],
        }),
      }),
    },
    {
      axelarConfigClient: createAxelarConfigClient(env),
    },
    env
  );
