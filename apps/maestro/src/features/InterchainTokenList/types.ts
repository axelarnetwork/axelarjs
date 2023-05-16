import type { EVMChainConfig, GMPTxStatus } from "@axelarjs/api";

import type { WagmiEVMChainConfig } from "~/config/wagmi";

export type TokenInfo = {
  chainId: number;
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  isSelected?: boolean;
  chain?: EVMChainConfig;
  wagmiConfig?: WagmiEVMChainConfig;
  deploymentStatus?: "pending" | GMPTxStatus;
};
