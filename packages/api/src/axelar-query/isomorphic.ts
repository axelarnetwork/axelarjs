import {
  createGMPBrowserClient,
  createGMPNodeClient,
  GetFeesParams,
  GMPClient,
} from "..";
import {
  ClientOptions,
  IsomorphicHTTPClient,
  type ClientMeta,
} from "../IsomorphicHTTPClient";

export class AxelarQueryAPIClient extends IsomorphicHTTPClient {
  protected gmpClient: GMPClient;

  public constructor(options: ClientOptions, meta?: ClientMeta) {
    super(options, meta);
    const gmpClientOptions = {
      prefixUrl: "https://testnet.api.gmp.axelarscan.io",
    }; //TODO - hard coded
    this.gmpClient =
      options.target === "browser"
        ? createGMPBrowserClient(gmpClientOptions)
        : createGMPNodeClient(gmpClientOptions);
  }

  static init(options: ClientOptions) {
    return new AxelarQueryAPIClient(options, {
      name: "AxelarQueryAPI",
      version: "0.0.1",
    });
  }

  async estimateGasFee(params: GetFeesParams) {
    const feeAPI = await this.gmpClient.getFees(params);
    return feeAPI;
  }
}
