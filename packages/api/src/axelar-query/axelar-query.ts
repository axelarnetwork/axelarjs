import { Options } from "ky";

import { HTTPClient } from "../HTTPClient";

export class AxelarQueryAPIClient extends HTTPClient {
  static init(options: Options) {
    return new AxelarQueryAPIClient(options, {
      name: "AxelarQueryAPI",
      version: "0.0.1",
    });
  }
}
