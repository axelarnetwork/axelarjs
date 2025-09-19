import { HEDERA_CHAIN_ID } from "../hooks";

/**
 * This is set if the token doesn't use 18 decimals and the gas value of the multicall
 * needs to be scaled to match the decimals of the token.
 */
const CHAIN_GAS_VALUE_DECIMALS = {
  [HEDERA_CHAIN_ID]: 8,
};

/** the gas fee is with 18 decimals, but the gasValue is with the decimals of the token */
export const scaleGasValue = (
  chainId: number,
  value18Decimals: bigint | undefined
) => {
  if (!value18Decimals) {
    return 0n;
  }

  const chainGasValueDecimals = CHAIN_GAS_VALUE_DECIMALS[chainId];

  if (!chainGasValueDecimals) {
    return value18Decimals;
  }

  const targetDecimals = 18;
  const factor = 10n ** BigInt(targetDecimals - chainGasValueDecimals);

  return value18Decimals / factor;
};
