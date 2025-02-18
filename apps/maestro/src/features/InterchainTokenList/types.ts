import type { EVMChainConfig, GMPTxStatus } from "@axelarjs/api/index";

import type { ExtendedWagmiChainConfig } from "~/config/chains";

type Kind = "canonical" | "interchain";

export type TokenInfo = {
  axelarChainId: string;
  chainId: number;
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenManagerAddress: `0x${string}`;
  tokenId: `0x${string}`;
  decimals: number;
  kind: Kind;
  isSelected?: boolean;
  chain?: EVMChainConfig;
  wagmiConfig?: ExtendedWagmiChainConfig;
  deploymentStatus?: "pending" | GMPTxStatus;
  deploymentTxHash?: `0x${string}:${number}`;
};
