import {
  IsomorphicHTTPClient,
  type ClientOptions,
} from "../IsomorphicHTTPClient";
import type {
  DepositAddressResponse,
  GetDepositAddressParams,
  GetOTCParams,
  OTC,
} from "./types";

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
      .json<OTC>();
    return res;
  }

  async requestDepositAddress(
    params: GetDepositAddressParams
  ): Promise<DepositAddressResponse> {
    return await this.client
      .post("transfer-assets", {
        json: { ...params },
      })
      .json<DepositAddressResponse>();
  }
}
