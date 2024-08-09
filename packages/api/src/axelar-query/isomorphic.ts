import { Environment } from "@axelarjs/core";
import { ChainStatus } from "@axelarjs/proto/axelar/nexus/v1beta1/query";
import { HttpClient } from "@axelarjs/utils/http-client";

import { parseUnits } from "viem";

import type {
  AssetConfig,
  AxelarConfigClient,
  AxelarConfigsResponse,
} from "../axelar-config";
import type { AxelarscanClient } from "../axelarscan";
import type { GetBaseFeesResult } from "../gmp";
import type { GMPClient } from "../gmp/isomorphic";
import {
  RestService,
  type ClientMeta,
  type RestServiceOptions,
} from "../lib/rest-service";
import {
  AxelarQueryClient,
  type AxelarQueryClientType,
} from "./AxelarQueryClient";
import { DEFAULT_L1_EXECUTE_DATA } from "./constant";
import { EnvironmentConfigs, getConfigs } from "./constants";
import { getL1FeeForL2 } from "./fee";
import type {
  AxelarGMPResponse,
  BaseFeeResponse,
  EstimateGasFeeParams,
  EstimateGasFeeResponse,
  EvmChain,
  GetNativeGasBaseFeeOptions,
} from "./types";
import { gasToWei, multiplyFloatByBigInt } from "./utils/bigint";
import { throwIfInvalidChainIds } from "./utils/validateChain";

type AxelarscanClientDependencies = {
  axelarConfigClient: AxelarConfigClient;
  gmpClient: GMPClient;
  axelarscanClient: AxelarscanClient;
};

export class AxelarQueryAPIClient extends RestService {
  protected gmpClient: GMPClient;
  protected axelarScanClient: AxelarscanClient;
  protected axelarConfigClient: AxelarConfigClient;
  protected env: Environment;
  protected cachedChainConfig: AxelarConfigsResponse | undefined;

  private axelarQueryClient: AxelarQueryClientType | null;

  readonly axelarGMPServiceUrl: string;
  readonly axelarGMPServiceApi: HttpClient;
  readonly axelarRpcUrl: string;

  public constructor(
    options: RestServiceOptions,
    dependencies: AxelarscanClientDependencies,
    env: Environment,
    meta?: ClientMeta
  ) {
    super(options, meta);
    const links: EnvironmentConfigs = getConfigs(env);
    this.axelarQueryClient = null;
    this.axelarGMPServiceUrl = links.axelarGMPApiUrl;
    this.axelarRpcUrl = links.axelarRpcUrl;
    this.gmpClient = dependencies.gmpClient;
    this.axelarScanClient = dependencies.axelarscanClient;
    this.axelarConfigClient = dependencies.axelarConfigClient;
    this.env = env;
    this.axelarGMPServiceApi = new HttpClient({
      prefixUrl: this.axelarGMPServiceUrl,
    });
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

  private async getRpcUrls(chain: string) {
    const configs = await this.axelarScanClient.getChainConfigs();
    return configs.evm.find((c) => c.id === chain)?.endpoints?.rpc;
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
    const rpcUrls = await this.getRpcUrls(destinationChain);

    if (!rpcUrls) {
      throw new Error("Failed to retrieve RPC URL for the destination chain.");
    }

    // Calculate the L1 execution fee. This value is in ETH.
    let ethL1ExecutionFee;

    for (let i = 0; i < rpcUrls.length; i++) {
      try {
        ethL1ExecutionFee = await getL1FeeForL2(rpcUrls[i]!, {
          executeData: actualExecuteData,
          l1GasPrice: destination_native_token.l1_gas_price_in_units,
          l2Type: feeResponse.l2_type,
          l1GasOracleAddress:
            feeResponse.destination_native_token.l1_gas_oracle_address,
        });
        break;
      } catch (e) {
        // Retry with the next RPC URL
      }
    }

    if (ethL1ExecutionFee === undefined) {
      throw new Error("Failed to retrieve L1 execution fee.");
    }

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
        ? multiplyFloatByBigInt(actualGasMultiplier, excludedL1ExecutionFee)
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

  async getDenomFromSymbol(symbol: string, chainName: string) {
    const axelarConfigs = await this.getAxelarConfigs();

    // Throw error if the chain is not supported
    // Note: chains are stored in lowercase
    if (!Object.keys(axelarConfigs.chains).includes(chainName.toLowerCase())) {
      throw new Error(`Chain ${chainName} is not supported.`);
    }

    const allDenoms = Object.keys(axelarConfigs.assets);

    // Find the target denom
    const denom = allDenoms.find((denom) => {
      const asset = this.cachedChainConfig!.assets[denom] as AssetConfig;
      const assetSymbol = asset.chains[chainName]?.symbol?.toLowerCase();
      return assetSymbol?.toLowerCase() === symbol.toLowerCase();
    });

    // Throw error if the asset is not supported
    if (!denom) {
      throw new Error(`Asset ${symbol} is not supported on ${chainName}.`);
    }

    return axelarConfigs.assets[denom]!.id;
  }

  async getSymbolFromDenom(denom: string, chainName: string) {
    const axelarConfigs = await this.getAxelarConfigs();

    // Throw error if the chain is not supported
    // Note: chains are stored in lowercase
    if (!Object.keys(axelarConfigs.chains).includes(chainName.toLowerCase())) {
      throw new Error(`Chain ${chainName} is not supported.`);
    }

    // Find the target denom
    const asset = axelarConfigs.assets[denom];

    // Throw error if the asset is not supported
    if (!asset) {
      throw new Error(`Asset ${denom} is not supported.`);
    }

    const symbol = asset.chains[chainName]?.symbol;

    // Throw error if the asset is not supported on the chain
    if (!symbol) {
      throw new Error(`Asset ${denom} is not supported on ${chainName}.`);
    }

    return symbol;
  }

  private async getAxelarConfigs(): Promise<AxelarConfigsResponse> {
    // Cache all assets
    if (!this.cachedChainConfig) {
      this.cachedChainConfig = await this.axelarConfigClient.getAxelarConfigs(
        this.env
      );
    }

    if (!this.cachedChainConfig) {
      throw new Error("Failed to retrieve chain configs.");
    }

    return this.cachedChainConfig;
  }

  /**
   * Get a list of active chains.
   * @returns an array of active chains
   */
  public async getActiveChains(): Promise<string[]> {
    if (!this.axelarQueryClient) {
      this.axelarQueryClient =
        await AxelarQueryClient.initOrGetAxelarQueryClient({
          environment: this.env,
          axelarRpcUrl: this.axelarRpcUrl,
        });
    }

    return this.axelarQueryClient.nexus
      .Chains({ status: ChainStatus.CHAIN_STATUS_ACTIVATED })
      .then((resp) => resp.chains);
  }

  /**
   * Check if a chain is active.
   * @param chainId the chain id to check
   * @returns true if the chain is active, false otherwise
   */
  public isChainActive(chainId: EvmChain | string): Promise<boolean> {
    return this.getActiveChains()
      .then((chains) => chains.map((chain) => chain.toLowerCase()))
      .then((chains) => chains.includes(chainId.toLowerCase()));
  }

  /**
   * Throw an error if any chain in the list is inactive.
   * @param chainIds A list of chainIds to check
   */
  public async throwIfInactiveChains(chainIds: EvmChain[] | string[]) {
    const results = await Promise.all(
      chainIds.map((chainId) => this.isChainActive(chainId))
    );

    for (let i = 0; i < chainIds.length; i++) {
      if (!results[i]) {
        throw new Error(
          `Chain ${chainIds[i]} is not active. Please check the list of active chains using the getActiveChains() method.`
        );
      }
    }
  }

  /**
   * Gets the base fee in native token wei for a given source and destination chain combination.
   * @param sourceChainId
   * @param destinationChainId
   * @param options - Optional parameters:
   *   - sourceTokenSymbol
   *   - symbol
   *   - destinationContractAddress
   *   - sourceContractAddress
   *   - amount
   *   - amountInUnits
   * @returns A `BaseFeeResponse` object containing the base fee, express fee, source token information, execute gas multiplier, destination token information, L2 type, Ethereum token information, and success status.
   */
  public async getNativeGasBaseFee(
    sourceChainId: string,
    destinationChainId: string,
    options?: GetNativeGasBaseFeeOptions
  ): Promise<BaseFeeResponse> {
    let response: Promise<BaseFeeResponse>;
    try {
      await throwIfInvalidChainIds(
        [sourceChainId, destinationChainId],
        this.env
      );
      await this.throwIfInactiveChains([sourceChainId, destinationChainId]);

      response = this.axelarGMPServiceApi
        .post("", {
          method: "getFees",
          destinationChain: destinationChainId,
          sourceChain: sourceChainId,
          sourceTokenSymbol: options?.sourceTokenSymbol,
          symbol: options?.symbol,
          destinationContractAddress: options?.destinationContractAddress,
          sourceContractAddress: options?.sourceContractAddress,
          amount: options?.amount,
          amountInUnits: options?.amountInUnits,
        })
        .json()
        .then((response) => {
          const typedResponse = response as AxelarGMPResponse;
          const {
            source_base_fee_string,
            source_token,
            ethereum_token,
            destination_native_token,
            express_fee_string,
            express_supported,
            l2_type,
            execute_gas_multiplier,
          } = typedResponse.result;

          const { decimals: sourceTokenDecimals } = source_token;
          const baseFee = parseUnits(
            source_base_fee_string,
            sourceTokenDecimals
          ).toString();
          const expressFee = express_fee_string
            ? parseUnits(express_fee_string, sourceTokenDecimals).toString()
            : "0";

          return {
            baseFee,
            expressFee,
            sourceToken: source_token,
            executeGasMultiplier: parseFloat(execute_gas_multiplier.toFixed(2)),
            destToken: {
              gas_price: destination_native_token.gas_price,
              decimals: destination_native_token.decimals,
              token_price: destination_native_token.token_price,
              name: destination_native_token.name,
              symbol: destination_native_token.symbol,
              l1_gas_oracle_address:
                destination_native_token.l1_gas_oracle_address,
              l1_gas_price_in_units:
                destination_native_token.l1_gas_price_in_units,
            },
            l2_type,
            ethereumToken: ethereum_token,
            apiResponse: typedResponse,
            success: true,
            expressSupported: express_supported,
            error: null,
          };
        });
    } catch (e) {
      return { success: false, error: e };
    }
    return response;
  }
}
