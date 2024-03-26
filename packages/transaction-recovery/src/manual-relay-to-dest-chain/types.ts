import { Environment } from "@axelarjs/core";

export type ManualRelayToDestChainParams = {
  environment: Environment;
  txHash: `0x${string}`;
  escapeAfterConfirm: boolean;
  options: ManualRelayToDestChainOptions;
};

export type ManualRelayToDestChainOptions = {
  txLogIndex?: number | undefined;
  txEventIndex?: number | undefined;
  messageId?: string | undefined;
};

export enum RouteDir {
  COSMOS_TO_EVM = "cosmos_to_evm",
  EVM_TO_COSMOS = "evm_to_cosmos",
  EVM_TO_EVM = "evm_to_evm",
}

export type EvmSignerOptions = {
  privateKey?: `0x${string}`;
  rpcUrl?: string;
};

export type RecoveryTxType =
  | "axelar_confirm_gateway_tx"
  | "axelar_sign_commands"
  | "axelar_route_message"
  | "evm_gateway_approve";

export type RecoveryTx = {
  hash: string;
  type: RecoveryTxType;
};

export type RecoveryTxResponse = {
  skip: boolean;
  skipReason?: string | undefined;
  error?: Error | undefined;
  tx?: RecoveryTx | undefined;
};
