import { AXELARSCAN_API_URLS, Environment } from "@axelarjs/core";

import {
  createGMPBrowserClient,
  createGMPNodeClient,
  EstimateGasFeeParams,
  EstimateGasFeeResponse,
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

  public constructor(
    env: Environment,
    options: ClientOptions,
    meta?: ClientMeta
  ) {
    super(options, meta);
    this.gmpClient =
      options.target === "browser"
        ? createGMPBrowserClient({
            prefixUrl: AXELARSCAN_API_URLS[env],
          })
        : createGMPNodeClient({
            prefixUrl: AXELARSCAN_API_URLS[env],
          });
  }

  static init(env: Environment, options: ClientOptions) {
    return new AxelarQueryAPIClient(env, options, {
      name: "AxelarQueryAPI",
      version: "0.0.1",
    });
  }

  async estimateGasFee({
    minGasPrice = "0",
    sourceChain,
    destinationChain,
    sourceContractAddress,
    sourceTokenAddress,
    sourceTokenSymbol,
    destinationContractAddress,
    gasLimit = 1_000_000n,
    gasMultiplier = 1.0,
    showDetailedFees = false,
    amount,
    amountInUnits,
  }: EstimateGasFeeParams): Promise<EstimateGasFeeResponse | string> {
    const response = await this.gmpClient.getFees({
      sourceChain,
      destinationChain,
      sourceTokenSymbol,
      sourceContractAddress,
      sourceTokenAddress,
      destinationContractAddress,
      amount,
      amountInUnits,
    });

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
      gasLimit,
      destination_native_token.gas_price,
      destination_native_token.decimals
    );
    const minDestGasFeeWei = gasLimit * BigInt(minGasPrice); //minGasPrice already provided by the user in wei

    const srcGasFeeWei = BigNumberUtils.multiplyToGetWei(
      gasLimit,
      source_token.gas_price,
      source_token.decimals
    );

    const executionFee =
      destGasFeeWei > minDestGasFeeWei
        ? srcGasFeeWei
        : (srcGasFeeWei * minDestGasFeeWei) / destGasFeeWei;
    const executionFeeWithMultiplier =
      gasMultiplier > 1
        ? Number(executionFee) * Number(gasMultiplier)
        : executionFee;

    return showDetailedFees
      ? {
          baseFee: base_fee,
          expressFee: express_fee_string,
          executionFee: executionFee.toString(),
          executionFeeWithMultiplier: executionFeeWithMultiplier.toString(),
          gasLimit,
          gasMultiplier,
          minGasPrice: minGasPrice === "0" ? "NA" : minGasPrice,
          apiResponse: JSON.stringify(response),
          isExpressSupported: express_supported,
        }
      : (Number(executionFeeWithMultiplier) + Number(base_fee)).toFixed(0);
  }
}
