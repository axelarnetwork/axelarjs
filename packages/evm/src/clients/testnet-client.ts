import {
  createPublicClient as _createPublicClient,
  http,
  type Chain,
  type HttpTransport,
  type PublicClient,
} from "viem";
import {
  arbitrumSepolia,
  auroraTestnet,
  avalancheFuji,
  baseSepolia,
  blastSepolia,
  celoAlfajores,
  fantomTestnet,
  filecoinHyperspace,
  fraxtalTestnet,
  mantleTestnet,
  optimismSepolia,
  scrollSepolia,
  sepolia,
} from "viem/chains";

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
