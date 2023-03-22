import { GasToken } from "@axelar-network/axelarjs-sdk";

export const getNativeToken = (chainId: string) => {
  const gasTokenMap: Record<string, GasToken> = {
    avalanche: GasToken.AVAX,
    "ethereum-2": GasToken.ETH,
    ethereum: GasToken.ETH,
    moonbeam: GasToken.GLMR,
    fantom: GasToken.FTM,
    polygon: GasToken.MATIC,
    aurora: GasToken.AURORA,
    binance: GasToken.BINANCE,
    celo: GasToken.CELO,
    kava: GasToken.KAVA,
  };
  if (!gasTokenMap[chainId.toLowerCase()])
    throw `getNativeToken(): chain ${chainId} does not exist`;

  return gasTokenMap[chainId.toLowerCase()];
};
