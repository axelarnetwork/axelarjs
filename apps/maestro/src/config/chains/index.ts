import { EVM_CHAIN_CONFIGS } from "./evm-chains";
import { VM_CHAIN_CONFIGS, WAGMI_VM_CHAIN_CONFIGS } from "./vm-chains";

export * from "./evm-chains";
export * from "./vm-chains";

export const CHAIN_CONFIGS = [...EVM_CHAIN_CONFIGS, ...VM_CHAIN_CONFIGS];

export const WAGMI_CHAIN_CONFIGS = [...EVM_CHAIN_CONFIGS, ...WAGMI_VM_CHAIN_CONFIGS]
