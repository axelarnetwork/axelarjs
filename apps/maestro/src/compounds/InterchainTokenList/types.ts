import { EVMChainConfig } from "@axelarjs/axelarscan";

import { WagmiEVMChainConfig } from "~/config/wagmi";
import { GMPStatus } from "~/services/gmp/types";

export type TokenInfo = {
  chainId: number;
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  isSelected?: boolean;
  chain?: EVMChainConfig;
  wagmiConfig?: WagmiEVMChainConfig;
  deploymentStatus?: "pending" | GMPStatus;
};
