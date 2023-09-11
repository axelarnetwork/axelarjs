import { ClientOptions, IsomorphicHTTPClient } from "../IsomorphicHTTPClient";

export class S3Client extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
    return new S3Client(options, {
      name: "S3Client",
      version: "0.0.1",
    });
  }

  async getChainConfigs() {
    return this.client.get("").json<any>();
  }
}
