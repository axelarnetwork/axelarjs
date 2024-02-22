import {
  createPublicClient as _createPublicClient,
  http,
  type HttpTransport,
  type PublicClient,
} from "viem";
import {
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  goerli,
  mainnet,
  mantle,
  mantleTestnet,
  optimism,
  optimismGoerli,
  scroll,
  scrollSepolia,
} from "viem/chains";

const MAINNET_CHAINS = {
  mainnet,
  fantom,
  filecoin,
  goerli,
  arbitrum,
  aurora,
  avalanche,
  celo,
  mantle,
  optimism,
  scroll,
  base,
  baseGoerli,
} as const;

const TESTNET_CHAINS = {
  goerli,
  arbitrumGoerli,
  baseGoerli,
  fantomTestnet,
  filecoinHyperspace,
  auroraTestnet,
  avalancheFuji,
  celoAlfajores,
  mantleTestnet,
  optimismGoerli,
  scrollSepolia,
} as const;

export type SupportedMainnetChain = keyof typeof MAINNET_CHAINS;
export type SupportedTestnetChain = keyof typeof TESTNET_CHAINS;

export function createPublicClient(
  chainName: SupportedMainnetChain
): PublicClient<HttpTransport, (typeof MAINNET_CHAINS)[typeof chainName]> {
  const chain = MAINNET_CHAINS[chainName];

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}

export function createPublicTestnetClient(
  chainName: SupportedTestnetChain
): PublicClient<HttpTransport, (typeof TESTNET_CHAINS)[typeof chainName]> {
  const chain = TESTNET_CHAINS[chainName];

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}
