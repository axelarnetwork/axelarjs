import ky, { type Options } from "ky";

import { GMPClient } from "./isomorphic";

export const createGMPBrowserClient = (options: Options) =>
  GMPClient.init({
    target: "browser",
    instance: ky.extend(options),
  });
