import {
  arbitrum,
  arbitrumGoerli,
  base,
  baseGoerli,
  mantle,
  mantleTestnet,
  optimism,
  optimismGoerli,
  scroll,
  scrollSepolia,
} from "viem/chains";

import { TokenUnit } from "../../gmp";

export type L2Chain = "optimism" | "arbitrum" | "mantle" | "base" | "scroll";

export const MAINNET_L1_CHAINS = {
  arbitrum,
  base,
  optimism,
  scroll,
  mantle,
} as const;

export const TESTNET_L1_CHAINS = {
  arbitrum: arbitrumGoerli,
  base: baseGoerli,
  optimism: optimismGoerli,
  scroll: scrollSepolia,
  mantle: mantleTestnet,
} as const;

export type EstimateL1FeeParams = {
  destinationContractAddress?: `0x${string}` | undefined;
  executeData: `0x${string}`;
  l1GasPrice: TokenUnit;
};
