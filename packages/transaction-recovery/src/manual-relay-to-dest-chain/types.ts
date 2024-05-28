import { Environment } from "@axelarjs/core";

export type ManualRelayToDestChainParams = {
  environment: Environment;
  txHash: `0x${string}`;
  options?: ManualRelayToDestChainOptions;
};

export type ManualRelayToDestChainOptions = {
  escapeAfterConfirm?: boolean | undefined;
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
  | "axelar.confirm_gateway_tx"
  | "axelar.sign_commands"
  | "axelar.route_message"
  | "evm.gateway_approve";

export type RecoveryTx = {
  hash: string;
};

export type RecoveryTxResponse = {
  skip: boolean;
  type: RecoveryTxType;
  skipReason?: string | undefined;
  error?: Error | undefined;
  tx?: RecoveryTx | undefined;
};
