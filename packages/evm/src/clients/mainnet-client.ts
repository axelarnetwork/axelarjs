import {
  createPublicClient as _createPublicClient,
  http,
  type Chain,
  type HttpTransport,
  type PublicClient,
} from "viem";
import {
  arbitrum,
  aurora,
  avalanche,
  base,
  blast,
  celo,
  fantom,
  filecoin,
  fraxtal,
  mainnet,
  mantle,
  optimism,
  scroll,
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

export type SupportedMainnetChain = keyof typeof MAINNET_CHAINS;

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
