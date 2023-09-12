import {
  createGMPBrowserClient,
  createGMPNodeClient,
  EstimateGasFeeParams,
  GetFeesParams,
  GMPClient,
} from "..";
import {
  ClientOptions,
  IsomorphicHTTPClient,
  type ClientMeta,
} from "../IsomorphicHTTPClient";
import { BigNumberUtils } from "./helpers/BigNumberUtils";

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

  async estimateGasFee(params: EstimateGasFeeParams) {
    const getFeesParams: GetFeesParams = {
      sourceChain: params.sourceChain,
      destinationChain: params.destinationChain,
      sourceTokenSymbol: params.sourceTokenSymbol ?? "",
    };
    const response = await this.gmpClient.getFees(getFeesParams);

    const {
      base_fee,
      express_fee_string,
      source_token,
      destination_native_token,
      express_supported,
    } = response;

    if (!response || !base_fee || !source_token) {
      throw new Error(
        "Failed to retrieve fee estimate from API. Please try again later."
      );
    }

    const destGasFeeWei = BigNumberUtils.multiplyToGetWei(
      params.gasLimit,
      destination_native_token.gas_price,
      destination_native_token.decimals
    );
    const minDestGasFeeWei = params.gasLimit * BigInt(params.minGasPrice ?? ""); //minGasPrice already provided by the user in wei

    const srcGasFeeWei = BigNumberUtils.multiplyToGetWei(
      params.gasLimit,
      source_token.gas_price,
      source_token.decimals
    );

    const executionFee =
      destGasFeeWei > minDestGasFeeWei
        ? srcGasFeeWei
        : (srcGasFeeWei * minDestGasFeeWei) / destGasFeeWei;
    const executionFeeWithMultiplier =
      params.gasMultiplier && params.gasMultiplier > 1
        ? executionFee * BigInt(params.gasMultiplier)
        : executionFee;

    // return params?.showDetailedFees
    //   ? {
    //       baseFee,
    //       expressFee,
    //       executionFee: executionFee.toString(),
    //       executionFeeWithMultiplier: executionFeeWithMultiplier.toString(),
    //       gasLimit,
    //       gasMultiplier,
    //       minGasPrice: minGasPrice === "0" ? "NA" : minGasPrice,
    //       apiResponse,
    //       isExpressSupported: expressSupported,
    //     }
    //   : executionFeeWithMultiplier.add(baseFee).toString();

    return response;
  }
}
