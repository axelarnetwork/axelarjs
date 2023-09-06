import { ClientOptions, IsomorphicHTTPClient } from "../IsomorphicHTTPClient";

export class AxelarQueryAPIClient extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
    return new AxelarQueryAPIClient(options, {
      name: "AxelarQueryAPI",
      version: "0.0.1",
    });
  }
}
