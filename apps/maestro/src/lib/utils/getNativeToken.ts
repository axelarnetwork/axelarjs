import { GAS_TOKENS, type GasTokenKind } from "@axelarjs/evm";

const GAS_TOKEN_MAP: Record<string, GasTokenKind> = {
  avalanche: GAS_TOKENS.AVAX,
  "ethereum-2": GAS_TOKENS.ETH,
  ethereum: GAS_TOKENS.ETH,
  moonbeam: GAS_TOKENS.GLMR,
  fantom: GAS_TOKENS.FTM,
  polygon: GAS_TOKENS.MATIC,
  aurora: GAS_TOKENS.AURORA,
  binance: GAS_TOKENS.BINANCE,
  celo: GAS_TOKENS.CELO,
  kava: GAS_TOKENS.KAVA,
  base: GAS_TOKENS.BASE,
  arbitrum: GAS_TOKENS.ARBITRUM,
  linea: GAS_TOKENS.LINEA,
};

export function getNativeToken(chainId: string) {
  if (!GAS_TOKEN_MAP[chainId?.toLowerCase()]) {
    throw `getNativeToken(): chain ${chainId} does not exist`;
  }

  return GAS_TOKEN_MAP[chainId?.toLowerCase()];
}
