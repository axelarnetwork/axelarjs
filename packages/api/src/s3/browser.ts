import ky, { type Options } from "ky";

import { S3Client } from "./isomorphic";

export const createS3BrowserClient = (options: Options) =>
  S3Client.init({
    target: "browser",
    instance: ky.extend(options),
  });
