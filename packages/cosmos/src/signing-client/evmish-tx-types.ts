import {
  AddChainRequest,
  ConfirmDepositRequest,
  ConfirmGatewayTxRequest,
  ConfirmTokenRequest,
  ConfirmTransferKeyRequest,
  CreateBurnTokensRequest,
  CreateDeployTokenRequest,
  CreatePendingTransfersRequest,
  CreateTransferOperatorshipRequest,
  CreateTransferOwnershipRequest,
  LinkRequest,
  protobufPackage,
  RetryFailedEventRequest,
  SetGatewayRequest,
  SignCommandsRequest,
} from "@axelarjs/proto/axelar/evm/v1beta1/tx";
import { Registry } from "@cosmjs/proto-signing";

const TxTypeUrlMap = {
  EvmLinkRequest: `/${protobufPackage}.LinkRequest`,
  EvmSetGatewayRequest: `/${protobufPackage}.SetGatewayRequest`,
  EvmConfirmGatewayTxRequest: `/${protobufPackage}.ConfirmGatewayTxRequest`,
  EvmConfirmDepositRequest: `/${protobufPackage}.ConfirmDepositRequest`,
  EvmConfirmTokenRequest: `/${protobufPackage}.ConfirmTokenRequest`,
  EvmConfirmTransferKeyRequest: `/${protobufPackage}.ConfirmTransferKeyRequest`,
  EvmCreateBurnTokensRequest: `/${protobufPackage}.CreateBurnTokensRequest`,
  EvmCreateDeployTokenRequest: `/${protobufPackage}.CreateDeployTokenRequest`,
  EvmCreatePendingTransfersRequest: `/${protobufPackage}.CreatePendingTransfersRequest`,
  EvmCreateTransferOperatorshipRequest: `/${protobufPackage}.CreateTransferOperatorshipRequest`,
  EvmCreateTransferOwnershipRequest: `/${protobufPackage}.CreateTransferOwnershipRequest`,
  EvmSignCommandsRequest: `/${protobufPackage}.SignCommandsRequest`,
  EvmAddChainRequest: `/${protobufPackage}.AddChainRequest`,
  EvmRetryFailedEventRequest: `/${protobufPackage}.RetryFailedEventRequest`,
};

const EVM_TYPE_PAIRS = [
  [TxTypeUrlMap.EvmLinkRequest, LinkRequest],
  [TxTypeUrlMap.EvmSetGatewayRequest, SetGatewayRequest],
  [TxTypeUrlMap.EvmConfirmGatewayTxRequest, ConfirmGatewayTxRequest],
  [TxTypeUrlMap.EvmConfirmDepositRequest, ConfirmDepositRequest],
  [TxTypeUrlMap.EvmConfirmTokenRequest, ConfirmTokenRequest],
  [TxTypeUrlMap.EvmConfirmTransferKeyRequest, ConfirmTransferKeyRequest],
  [TxTypeUrlMap.EvmCreateBurnTokensRequest, CreateBurnTokensRequest],
  [TxTypeUrlMap.EvmCreateDeployTokenRequest, CreateDeployTokenRequest],
  [
    TxTypeUrlMap.EvmCreatePendingTransfersRequest,
    CreatePendingTransfersRequest,
  ],
  [
    TxTypeUrlMap.EvmCreateTransferOperatorshipRequest,
    CreateTransferOperatorshipRequest,
  ],
  [
    TxTypeUrlMap.EvmCreateTransferOwnershipRequest,
    CreateTransferOwnershipRequest,
  ],
  [TxTypeUrlMap.EvmSignCommandsRequest, SignCommandsRequest],
  [TxTypeUrlMap.EvmAddChainRequest, AddChainRequest],
  [TxTypeUrlMap.EvmRetryFailedEventRequest, RetryFailedEventRequest],
] as const;

export function registerEvmTxTypes(registry: Registry) {
  for (const [typeUrl, codec] of EVM_TYPE_PAIRS) {
    registry.register(typeUrl, codec);
  }
}
