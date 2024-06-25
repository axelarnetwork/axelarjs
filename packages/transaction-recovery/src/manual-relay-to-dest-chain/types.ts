import { Environment } from "@axelarjs/core";

export type ManualRelayToDestChainParams = {
  environment: Environment;
  txHash: `0x${string}`;
  options?: ManualRelayToDestChainOptions;
};

export type ChainConfig = {
  chain_type: "evm" | "cosmos";
  id: string;
  name: string;
  rpcUrl?: string | undefined;
};

export type ManualRelayToDestChainOptions = {
  escapeAfterConfirm?: boolean;
  txLogIndex?: number;
  messageId?: string;
};

export enum RouteDir {
  COSMOS_TO_EVM = "cosmos_to_evm",
  EVM_TO_COSMOS = "evm_to_cosmos",
  EVM_TO_EVM = "evm_to_evm",
  COSMOS_TO_COSMOS = "cosmos_to_cosmos",
}

export type EvmSignerOptions = {
  privateKey?: `0x${string}`;
  rpcUrl?: string;
};

export type RecoveryTxResponse = {
  skip: boolean;
  type: RecoveryTxType;
  skipReason?: string | undefined;
  error?: string | undefined;
  tx?: RecoveryTx | undefined;
};

export type RecoveryTxType =
  | "axelar.confirm_gateway_tx"
  | "axelar.sign_commands"
  | "axelar.route_message"
  | "evm.gateway_approve";

export type RecoveryTx = {
  transactionHash: string;
};

export type ManualRelayToDestChainResponse = {
  success: boolean;
  type: RouteDir;
  logs: string[];
  error?: string | undefined;
  confirmTx?: RecoveryTx | undefined;
  signCommandTx?: RecoveryTx | undefined;
  routeMessageTx?: RecoveryTx | undefined;
  gatewayApproveTx?: RecoveryTx | undefined;
};
