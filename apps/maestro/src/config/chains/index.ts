import { EVM_CHAIN_CONFIGS, HEDERA_CHAIN_ID } from "./evm-chains";
import { VM_CHAIN_CONFIGS, WAGMI_VM_CHAIN_CONFIGS } from "./vm-chains";

export * from "./evm-chains";
export * from "./utils";
export * from "./vm-chains";

export const CHAIN_CONFIGS = [...EVM_CHAIN_CONFIGS, ...VM_CHAIN_CONFIGS];

// indicates whether to take the *last* rpc in the array of available RPCs
// note that the order of the RPC URLs is `[...customUrls, ...extras, ...baseUrls]`
// (currently only used in the case of Hedera where a non-public RPC endpoint is in use)
const CHAINS_WITH_CUSTOM_PRIVATE_RPCS = [HEDERA_CHAIN_ID];

export const WAGMI_CHAIN_CONFIGS = [
  ...EVM_CHAIN_CONFIGS,
  ...WAGMI_VM_CHAIN_CONFIGS,
].map((chain) =>
  CHAINS_WITH_CUSTOM_PRIVATE_RPCS.includes(chain.id)
    ? {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: { http: [chain.rpcUrls.default.http.at(-1)] },
          public: { http: [chain.rpcUrls.public.http.at(-1)] },
        },
      }
    : chain
);
