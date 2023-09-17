import {
  IsomorphicHTTPClient,
  type ClientOptions,
} from "../IsomorphicHTTPClient";
import type { GetOTCParams, OTC } from "./types";

export class DepositAddressClient extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
    return new DepositAddressClient(options, {
      name: "DepositAddressClient",
      version: "0.0.1",
    });
  }

  async getOTC(params: GetOTCParams): Promise<OTC> {
    const res = await this.client
      .get(`otc?publicAddress=${params.signerAddress}`)
      .json<any>();
    console.log("otc Ressss", res);
    return res;
  }

  async requestDepositAddress(params: GetOTCParams): Promise<any> {
    return await this.client
      .post("", {
        json: { ...params, method: "searchGMP" },
      })
      .json<any>();
  }
}
