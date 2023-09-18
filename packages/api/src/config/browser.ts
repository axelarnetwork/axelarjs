import ky, { type Options } from "ky";

import { ConfigClient } from "./isomorphic";

export const createS3BrowserClient = (options: Options) =>
  ConfigClient.init({
    target: "browser",
    instance: ky.extend(options),
  });
