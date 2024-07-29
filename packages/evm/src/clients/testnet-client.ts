import {
  createPublicClient as _createPublicClient,
  http,
  type Chain,
  type HttpTransport,
  type PublicClient,
} from "viem";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  blastSepolia,
  bscTestnet,
  celoAlfajores,
  fantomTestnet,
  filecoinCalibration,
  fraxtalTestnet,
  immutableZkEvmTestnet,
  kavaTestnet,
  lineaTestnet,
  mantleTestnet,
  moonbaseAlpha,
  optimismSepolia,
  polygonMumbai,
  scrollSepolia,
  sepolia,
} from "viem/chains";

import { centrifugeTestnet } from "./custom/centrifuge";

/**
 * Testnet chains
 */
export const TESTNET_CHAINS = {
  "ethereum-sepolia": sepolia,
  "arbitrum-sepolia": arbitrumSepolia,
  "avalanche-fuji": avalancheFuji,
  "base-sepolia": baseSepolia,
  fantom: fantomTestnet,
  "filecoin-2": filecoinCalibration,
  "linea-sepolia": lineaTestnet,
  "mantle-sepolia": mantleTestnet,
  "optimism-sepolia": optimismSepolia,
  immutable: immutableZkEvmTestnet,
  linea: lineaTestnet,
  moonbeam: moonbaseAlpha,
  "polygon-sepolia": polygonMumbai,
  polygon: polygonMumbai,
  binance: bscTestnet,
  avalanche: avalancheFuji,
  "blast-sepolia": blastSepolia,
  "centrifuge-2": centrifugeTestnet,
  celo: celoAlfajores,
  kava: kavaTestnet,
  scroll: scrollSepolia,
  fraxtal: fraxtalTestnet,
} as const;

export type SupportedTestnetChain = keyof typeof TESTNET_CHAINS;

export function createPublicTestnetClient(
  chainName: SupportedTestnetChain
): PublicClient<HttpTransport, Chain> {
  const chain = TESTNET_CHAINS[chainName] as Chain;

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}
