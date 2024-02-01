import { Environment } from "@axelarjs/core";

import { parseUnits } from "viem";

import type { GMPClient } from "../gmp/isomorphic";
import {
  RestService,
  type ClientMeta,
  type RestServiceOptions,
} from "../lib/rest-service";
import { getL1FeeForL2, isL2Chain } from "./fee";
import type { EstimateGasFeeParams, EstimateGasFeeResponse } from "./types";
import { gasToWei } from "./utils/bigint";

type AxelarscanClientDependencies = {
  gmpClient: GMPClient;
};

export class AxelarQueryAPIClient extends RestService {
  protected gmpClient: GMPClient;
  protected env: Environment;

  public constructor(
    options: RestServiceOptions,
    dependencies: AxelarscanClientDependencies,
    env: Environment,
    meta?: ClientMeta
  ) {
    super(options, meta);
    this.gmpClient = dependencies.gmpClient;
    this.env = env;
  }

  static init(
    options: RestServiceOptions,
    dependencies: AxelarscanClientDependencies,
    env: Environment
  ) {
    return new AxelarQueryAPIClient(options, dependencies, env, {
      name: "AxelarQueryAPI",
      version: "0.0.11",
    });
  }

  /**
   * Calculate estimated gas amount to pay for the gas receiver contract.
   * @param sourceChain Chain ID (as recognized by Axelar) of the source chain
   * @param destinationChain Chain ID (as recognized by Axelar) of the destination chain
   * @param sourceTokenSymbol (Optional) the token symbol on the source chain
   * @param sourceContractAddress (Optional) the address of the contract invoking the GMP call from the source chain
   * @param sourceTokenAddress (Optional) the contract address of the token symbol on the source chain
   * @param destinationContractAddress (Optional) the address of the contract invoking the GMP call from the source chain
   * @param amount (Optional) the amount of assets transferred in terms of symbol, not unit denom, e.g. use 1 for 1 axlUSDC, not 1000000
   * @param amountInUnits (Optional) the amount of assets transferred in terms of unit denom, not symbol, e.g. use 1000000 for 1 axlUSDC, not 1
   * @param minGasPrice (Optional) A minimum value, in wei, for the gas price on the destination chain that is used to override the estimated gas price if it falls below this specified value.
   * @param gasLimit (Optional) An estimated gas amount required to execute `executeWithToken` function. The default value is 1MM which should be sufficient for most transactions.
   * @param gasMultiplier (Optional) A multiplier used to create a buffer above the calculated gas fee, to account for potential slippage throughout tx execution, e.g. 1.1 = 10% buffer
   * @param showDetailedFees (Optional) will return the full breakdown of fee components if specified true
   * @returns
   */
  async estimateGasFee({
    sourceChain,
    destinationChain,
    sourceTokenSymbol,
    sourceContractAddress,
    sourceTokenAddress,
    destinationContractAddress,
    amount,
    amountInUnits,
    executeData,
    minGasPrice = "0",
    gasLimit = 1_000_000n,
    gasMultiplier = 1.0,
    showDetailedFees = false,
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
      ethereum_token,
      express_supported,
    } = response;

    if (!response || !source_token || isNaN(base_fee)) {
      throw new Error(
        "Failed to retrieve fee estimate from API. Please try again later."
      );
    }

    const destGasFeeWei = gasToWei(
      gasLimit,
      destination_native_token.gas_price,
      destination_native_token.decimals
    );
    const minDestGasFeeWei = BigInt(minGasPrice) * BigInt(gasLimit);

    const srcGasFeeWei = gasToWei(
      gasLimit,
      source_token.gas_price,
      source_token.decimals
    );

    const excludedL1ExecutionFee =
      destGasFeeWei > minDestGasFeeWei
        ? srcGasFeeWei
        : (srcGasFeeWei * minDestGasFeeWei) / destGasFeeWei;

    const excludedL1ExecutionFeeWithMultiplier =
      gasMultiplier > 1
        ? Math.floor(Number(excludedL1ExecutionFee) * Number(gasMultiplier))
        : excludedL1ExecutionFee;

    const baseFee = parseUnits(base_fee.toString(), source_token.decimals);

    let l1ExecutionFee = 0n;
    let l1ExecutionFeeWithMultiplier = 0;

    // If the destination chain is L2, calculate the L1 execution fee
    if (isL2Chain(destinationChain)) {
      if (!executeData) {
        throw new Error(
          `executeData is required to calculate the L1 execution fee for ${destinationChain}`
        );
      }

      if (!destination_native_token.l1_gas_price_in_units) {
        throw new Error(
          `Could not find L1 gas price for ${destinationChain}. Please try again later.`
        );
      }

      // Calculate the L1 execution fee. This value is in ETH.
      l1ExecutionFee = await getL1FeeForL2(this.env, destinationChain, {
        destinationContractAddress,
        executeData,
        l1GasPrice: destination_native_token.l1_gas_price_in_units,
      });

      // Convert the L1 execution fee to the source token
      const srcTokenPrice = Number(source_token.token_price.usd);
      const ethTokenPrice = Number(ethereum_token.token_price.usd);
      const ethToSrcTokenPriceRatio = ethTokenPrice / srcTokenPrice;

      l1ExecutionFee = BigInt(
        Math.ceil(Number(l1ExecutionFee) * ethToSrcTokenPriceRatio)
      );

      // Calculate the L1 execution fee with the gas multiplier
      l1ExecutionFeeWithMultiplier = Math.floor(
        Number(l1ExecutionFee) * Number(gasMultiplier)
      );
    }

    // If showDetailedFees is false, return the total fee amount
    if (!showDetailedFees) {
      return (
        BigInt(excludedL1ExecutionFeeWithMultiplier) +
        BigInt(l1ExecutionFeeWithMultiplier) +
        BigInt(baseFee)
      ).toString();
    }

    return {
      baseFee,
      expressFee: express_fee_string,
      executionFee: excludedL1ExecutionFee.toString(),
      executionFeeWithMultiplier:
        excludedL1ExecutionFeeWithMultiplier.toString(),
      l1ExecutionFeeWithMultiplier: l1ExecutionFeeWithMultiplier.toString(),
      l1ExecutionFee: l1ExecutionFee.toString(),
      gasLimit,
      gasMultiplier,
      minGasPrice: minGasPrice === "0" ? "NA" : minGasPrice,
      apiResponse: JSON.stringify(response),
      isExpressSupported: express_supported,
    };
  }
}
