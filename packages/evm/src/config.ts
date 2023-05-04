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
  Chain,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  goerli,
  mainnet,
} from "viem/chains";

export const TESTNET_CHAINS = [
  goerli,
  arbitrumGoerli,
  baseGoerli,
  fantomTestnet,
  filecoinHyperspace,
  auroraTestnet,
  avalancheFuji,
  celoAlfajores,
];

export const MAINNET_CHAINS = [
  fantom,
  filecoin,
  goerli,
  arbitrum,
  aurora,
  avalanche,
  celo,
  mainnet,
];

export const CHAINS: (Chain & {
  isTestnet?: boolean;
})[] = [
  ...TESTNET_CHAINS.map((x) => ({ ...x, isTestnet: true })),
  ...MAINNET_CHAINS,
];
