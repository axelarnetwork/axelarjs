import type { GMPTxStatus } from "@axelarjs/api/index";

import type { ExtendedWagmiChainConfig } from "~/config/chains";
import { ITSChainConfig } from "~/server/chainConfig";

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
  chain?: ITSChainConfig;
  wagmiConfig?: ExtendedWagmiChainConfig;
  deploymentStatus?: "pending" | GMPTxStatus;
  deploymentTxHash?: `0x${string}:${number}`;
};
