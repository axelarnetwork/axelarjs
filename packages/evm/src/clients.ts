import {
  createPublicClient as _createPublicClient,
  http,
  type Chain,
  type HttpTransport,
  type PublicClient,
} from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  fraxtal,
  fraxtalTestnet,
  mainnet,
  mantle,
  mantleTestnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  sepolia,
} from "viem/chains";

const MAINNET_CHAINS = {
  mainnet,
  fantom,
  filecoin,
  arbitrum,
  aurora,
  avalanche,
  celo,
  mantle,
  optimism,
  scroll,
  base,
  blast,
  fraxtal,
} as const;

const TESTNET_CHAINS = {
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  fantomTestnet,
  filecoinHyperspace,
  auroraTestnet,
  avalancheFuji,
  celoAlfajores,
  mantleTestnet,
  optimismSepolia,
  scrollSepolia,
  blastSepolia,
  fraxtalTestnet,
} as const;

export type SupportedMainnetChain = keyof typeof MAINNET_CHAINS;
export type SupportedTestnetChain = keyof typeof TESTNET_CHAINS;

export function createPublicClient(
  chainName: SupportedMainnetChain
): PublicClient<HttpTransport, Chain> {
  const chain = MAINNET_CHAINS[chainName] as Chain;

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}

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
