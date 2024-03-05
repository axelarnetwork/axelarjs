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
