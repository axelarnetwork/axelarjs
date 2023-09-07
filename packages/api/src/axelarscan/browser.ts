import ky, { type Options } from "ky";

import { AxelarscanClient } from "./isomorphic";

export const createAxelarscanBrowserClient = (options: Options) =>
  AxelarscanClient.init({
    target: "browser",
    instance: ky.extend(options),
  });
