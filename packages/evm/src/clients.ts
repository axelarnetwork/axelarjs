import {
  createPublicClient as _createPublicClient,
  http,
  type PublicClient,
} from "viem";
import {
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  goerli,
  mainnet,
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
} as const;

export type SupportedMainnetChain = keyof typeof MAINNET_CHAINS;
export type SupportedTestnetChain = keyof typeof TESTNET_CHAINS;

export function createPublicClient(
  chainName: SupportedMainnetChain
): PublicClient {
  const chain = MAINNET_CHAINS[chainName];

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}

export function createPublicTestnetClient(
  chainName: SupportedTestnetChain
): PublicClient {
  const chain = TESTNET_CHAINS[chainName];

  const client = _createPublicClient({
    chain,
    transport: http(`${chain.rpcUrls.default.http[0]}`),
  });
  return client;
}
