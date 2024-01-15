import { zeroAddress } from "viem";

import { RestService, type RestServiceOptions } from "../lib/rest-service";
import type {
  DepositAddressNativeWrapParams,
  DepositAddressNativeWrapResponse,
} from "./types";

export class DepositServiceClient extends RestService {
  static init(options: RestServiceOptions) {
    return new DepositServiceClient(options, {
      name: "DepositServiceClient",
      version: "0.0.1",
    });
  }

  async getDepositAddressForNativeWrap(params: DepositAddressNativeWrapParams) {
    const endpoint = `/deposit/wrap`;
    const response = await this.client
      .post(endpoint, {
        json: {
          salt: params.salt,
          source_chain: params.fromChain,
          destination_chain: params.toChain,
          destination_address: params.destinationAddress,
          refund_address: params.refundAddress,
          token_symbol: zeroAddress,
        },
      })
      .json<DepositAddressNativeWrapResponse>();

    return response;
  }
}
