import { Environment } from "@axelarjs/core";

import { parseUnits } from "viem";

import type { AxelarscanClient } from "../axelarscan";
import type { GetBaseFeesResult } from "../gmp";
import type { GMPClient } from "../gmp/isomorphic";
import {
  RestService,
  type ClientMeta,
  type RestServiceOptions,
} from "../lib/rest-service";
import { DEFAULT_L1_EXECUTE_DATA } from "./constant";
import { getL1FeeForL2 } from "./fee";
import type { EstimateGasFeeParams, EstimateGasFeeResponse } from "./types";
import { gasToWei, multiplyFloatByBigInt } from "./utils/bigint";

type AxelarscanClientDependencies = {
  gmpClient: GMPClient;
  axelarscanClient: AxelarscanClient;
};

export class AxelarQueryAPIClient extends RestService {
  protected gmpClient: GMPClient;
  protected axelarScanClient: AxelarscanClient;
  protected env: Environment;

  public constructor(
    options: RestServiceOptions,
    dependencies: AxelarscanClientDependencies,
    env: Environment,
    meta?: ClientMeta
  ) {
    super(options, meta);
    this.gmpClient = dependencies.gmpClient;
    this.axelarScanClient = dependencies.axelarscanClient;
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

  private async getRpcUrl(chain: string) {
    const configs = await this.axelarScanClient.getChainConfigs();
    return configs.evm.find((c) => c.id === chain)?.endpoints?.rpc?.[0];
  }

  private async _getL1FeeForL2(
    executeData: `0x${string}` | undefined,
    destinationChain: string,
    actualGasMultiplier: number,
    feeResponse: GetBaseFeesResult
  ) {
    const { destination_native_token, source_token, ethereum_token } =
      feeResponse;

    if (!destination_native_token.l1_gas_price_in_units) {
      return {
        l1ExecutionFee: 0n,
        l1ExecutionFeeWithMultiplier: 0n,
      };
    }

    const actualExecuteData = executeData || DEFAULT_L1_EXECUTE_DATA;
    const rpcUrl = await this.getRpcUrl(destinationChain);

    if (!rpcUrl) {
      throw new Error("Failed to retrieve RPC URL for the destination chain.");
    }

    // Calculate the L1 execution fee. This value is in ETH.
    const ethL1ExecutionFee = await getL1FeeForL2(rpcUrl, {
      executeData: actualExecuteData,
      l1GasPrice: destination_native_token.l1_gas_price_in_units,
      l2Type: feeResponse.l2_type,
      l1GasOracleAddress:
        feeResponse.destination_native_token.l1_gas_oracle_address,
    });

    // Convert the L1 execution fee to the source token
    const srcTokenPrice = Number(source_token.token_price.usd);
    const ethTokenPrice = Number(ethereum_token.token_price.usd);
    const ethToSrcTokenPriceRatio = ethTokenPrice / srcTokenPrice;

    // Calculate the L1 execution fee in the source token
    const l1ExecutionFee = multiplyFloatByBigInt(
      ethToSrcTokenPriceRatio,
      ethL1ExecutionFee
    );

    // Calculate the L1 execution fee with the gas multiplier
    const l1ExecutionFeeWithMultiplier = multiplyFloatByBigInt(
      actualGasMultiplier,
      l1ExecutionFee
    );

    return {
      l1ExecutionFee,
      l1ExecutionFeeWithMultiplier,
    };
  }

  /**
   * Calculate estimated gas amount to pay for the gas receiver contract.
   * @param sourceChain Chain ID (as recognized by Axelar) of the source chain
   * @param destinationChain Chain ID (as recognized by Axelar) of the destination chain
   * @param gasLimit An estimated gas amount required to execute `executeWithToken` function.
   * @param sourceTokenSymbol (Optional) the token symbol on the source chain
   * @param sourceContractAddress (Optional) the address of the contract invoking the GMP call from the source chain
   * @param sourceTokenAddress (Optional) the contract address of the token symbol on the source chain
   * @param executeData (Optional) The data to be executed on the destination chain. It's recommended to specify it if the destination chain is an L2 chain to calculate more accurate gas fee.
   * @param destinationContractAddress (Optional) the destination contract address for checking express supported
   * @param amountInUnits (Optional) An amount (in the smallest denomination) that using in callContractWithToken for checking express supported
   * @param minGasPrice (Optional) A minimum value, in wei, for the gas price on the destination chain that is used to override the estimated gas price if it falls below this specified value.
   * @param gasMultiplier (Optional) A multiplier used to create a buffer above the calculated gas fee, to account for potential slippage throughout tx execution, e.g. 1.1 = 10% buffer. Default to "auto" which will use the gas multiplier from the GMP response.
   * @param showDetailedFees (Optional) will return the full breakdown of fee components if specified true
   * @returns
   */
  async estimateGasFee({
    sourceChain,
    destinationChain,
    gasLimit,
    sourceTokenSymbol,
    sourceContractAddress,
    sourceTokenAddress,
    destinationContractAddress,
    amountInUnits,
    executeData,
    minGasPrice = "0",
    gasMultiplier = "auto",
    showDetailedFees = false,
  }: EstimateGasFeeParams): Promise<EstimateGasFeeResponse | string> {
    if (gasLimit < 1) {
      throw new Error("Gas limit is too low.");
    }

    const response = await this.gmpClient.getFees({
      sourceChain,
      destinationChain,
      sourceTokenSymbol,
      sourceContractAddress,
      sourceTokenAddress,
      destinationContractAddress,
      amountInUnits,
    });

    const {
      base_fee,
      express_fee_string,
      source_token,
      destination_native_token,
      execute_gas_multiplier,
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

    const actualGasMultiplier =
      gasMultiplier === "auto"
        ? parseFloat(execute_gas_multiplier.toFixed(2))
        : gasMultiplier;

    const excludedL1ExecutionFeeWithMultiplier =
      actualGasMultiplier > 1
        ? Math.floor(
            Number(excludedL1ExecutionFee) * Number(actualGasMultiplier)
          )
        : excludedL1ExecutionFee;

    const baseFee = parseUnits(base_fee.toString(), source_token.decimals);

    const { l1ExecutionFee, l1ExecutionFeeWithMultiplier } =
      await this._getL1FeeForL2(
        executeData,
        destinationChain,
        actualGasMultiplier,
        response
      );

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
      gasMultiplier: actualGasMultiplier,
      minGasPrice: minGasPrice === "0" ? "NA" : minGasPrice,
      apiResponse: JSON.stringify(response),
      isExpressSupported: express_supported,
    };
  }
}
