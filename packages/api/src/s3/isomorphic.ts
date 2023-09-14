import { Environment } from "@axelarjs/core";

import { ClientOptions, IsomorphicHTTPClient } from "../IsomorphicHTTPClient";
import { S3Response } from "./types";

export class S3Client extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
    return new S3Client(options, {
      name: "S3Client",
      version: "0.0.1",
    });
  }

  async getChainConfigs(env: Environment) {
    return this.client
      .get(`configs/${env}-chain-config-latest.json`)
      .json<S3Response>();
  }
}
