import { RestService, type RestServiceOptions } from "../lib/rest-service";
import type {
  DepositAddressResponse,
  GetDepositAddressParams,
  GetOTCParams,
  OTC,
} from "./types";

export class DepositAddressClient extends RestService {
  static init(options: RestServiceOptions) {
    return new DepositAddressClient(options, {
      name: "DepositAddressClient",
      version: "0.1.0",
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
