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
    const feeAPI = await this.gmpClient.getFees(params);

    // await throwIfInvalidChainIds(
    //   [sourceChainId, destinationChainId],
    //   this.environment
    // );

    // const response = await this.getNativeGasBaseFee(
    //   sourceChainId,
    //   destinationChainId,
    //   sourceChainTokenSymbol as GasToken,
    //   gmpParams?.tokenSymbol,
    //   gmpParams?.destinationContractAddress,
    //   gmpParams?.sourceContractAddress,
    //   gmpParams?.transferAmount,
    //   gmpParams?.transferAmountInUnits
    // );

    // const {
    //   baseFee,
    //   expressFee,
    //   sourceToken,
    //   destToken,
    //   apiResponse,
    //   success,
    //   expressSupported,
    // } = response;

    // if (!success || !baseFee || !sourceToken) {
    //   throw new Error("Failed to estimate gas fee");
    // }

    // const destGasFeeWei = BigNumberUtils.multiplyToGetWei(
    //   BigNumber.from(gasLimit),
    //   destToken.gas_price,
    //   destToken.decimals
    // );
    // const minDestGasFeeWei = BigNumber.from(gasLimit).mul(minGasPrice); //minGasPrice already provided by the user in wei

    // const srcGasFeeWei = BigNumberUtils.multiplyToGetWei(
    //   BigNumber.from(gasLimit),
    //   sourceToken.gas_price,
    //   sourceToken.decimals
    // );

    // const executionFee = destGasFeeWei.gt(minDestGasFeeWei)
    //   ? srcGasFeeWei
    //   : srcGasFeeWei.mul(minDestGasFeeWei).div(destGasFeeWei);
    // const executionFeeWithMultiplier =
    //   gasMultiplier > 1
    //     ? executionFee.mul(gasMultiplier * 10000).div(10000)
    //     : executionFee;

    // return gmpParams?.showDetailedFees
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

    return feeAPI;
  }
}
