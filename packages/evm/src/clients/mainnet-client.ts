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
  bsc,
  celo,
  fantom,
  filecoin,
  flowMainnet,
  fraxtal,
  immutableZkEvm,
  kava,
  linea,
  mainnet,
  mantle,
  moonbeam,
  optimism,
  plume,
  polygon,
  scroll,
} from "viem/chains";

import { centrifuge } from "./custom/centrifuge";

/**
 * Mainnet chains
 */
export const MAINNET_CHAINS = {
  mainnet,
  fantom,
  centrifuge,
  kava,
  linea,
  moonbeam,
  polygon,
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
  ethereum: mainnet,
  binance: bsc,
  immutable: immutableZkEvm,
  flow: flowMainnet,
  plume,
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
