import ky, { type Options } from "ky";

import { AxelarQueryAPIClient } from "./isomorphic";

export const createAxelarQueryBrowserClient = (options: Options) =>
  AxelarQueryAPIClient.init({
    target: "browser",
    instance: ky.extend(options),
  });
