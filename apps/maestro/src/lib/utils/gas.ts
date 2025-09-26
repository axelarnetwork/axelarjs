import { CHAIN_CONFIGS, HEDERA_CHAIN_ID } from "~/config/chains";

/**
 * This is set if the token doesn't use 18 decimals and the gas value of the multicall
 * needs to be scaled to match the decimals of the token.
 */
const CHAIN_GAS_VALUE_DECIMALS = {
  [HEDERA_CHAIN_ID]: 8,
};

/** Utility class for handling gas values and decimals */
export class Gas {
  private adjustedValue: bigint;
  private readonly chainId: number;
  private readonly decimals: number;

  /**
   * Constructor for the Gas class
   * @param value - The gas value to be adjusted
   * @param options - The options for the Gas class
   * @param options.chainId - The chain ID
   */
  constructor(value: bigint, options: { chainId: number }) {
    this.adjustedValue = value;
    this.chainId = options.chainId;

    const configDecimals = CHAIN_CONFIGS.find(
      (chain) => chain.id === this.chainId
    )?.nativeCurrency.decimals;

    if (configDecimals) {
      this.decimals = configDecimals;
    } else {
      console.warn(
        `Gas: chain ${this.chainId} does not have a native currency decimals, using 18 decimals`
      );
      this.decimals = 18;
    }
  }

  get value() {
    return this.adjustedValue;
  }

  get valueChainDecimals() {
    const chainGasValueDecimals = CHAIN_GAS_VALUE_DECIMALS[this.chainId];

    if (!chainGasValueDecimals) {
      return this.value;
    }

    const originalDecimals = this.decimals;
    const factor = 10n ** BigInt(originalDecimals - chainGasValueDecimals);

    const value = this.adjustedValue / factor;

    return value;
  }
}
