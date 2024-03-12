import type { Chain } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mantle,
  mantleTestnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
} from "viem/chains";

import { TokenUnit } from "../../gmp";

export type L2Chain = "optimism" | "arbitrum" | "mantle" | "base" | "scroll";

export const MAINNET_L2_CHAINS = {
  arbitrum,
  base,
  optimism,
  scroll,
  mantle,
} as Record<L2Chain, Chain>;

export const TESTNET_L2_CHAINS = {
  arbitrum: arbitrumSepolia,
  base: baseSepolia,
  optimism: optimismSepolia,
  scroll: scrollSepolia,
  mantle: mantleTestnet,
} as Record<L2Chain, Chain>;

export type EstimateL1FeeParams = {
  destinationContractAddress?: `0x${string}` | undefined;
  executeData: `0x${string}`;
  l1GasPrice: TokenUnit;
};
