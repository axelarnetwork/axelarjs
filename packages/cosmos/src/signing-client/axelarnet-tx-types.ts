import {
  AddCosmosBasedChainRequest,
  ConfirmDepositRequest,
  ExecutePendingTransfersRequest,
  LinkRequest,
  protobufPackage,
  RegisterAssetRequest,
  RegisterFeeCollectorRequest,
  RegisterIBCPathRequest,
  RouteIBCTransfersRequest,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/tx";

import type { Registry } from "@cosmjs/proto-signing";

const TxTypeUrlMap = {
  AxelarnetLinkRequest: `/${protobufPackage}.LinkRequest`,
  AxelarnetConfirmDepositRequest: `/${protobufPackage}.ConfirmDepositRequest`,
  AxelarnetExecutePendingTransfersRequest: `/${protobufPackage}.ExecutePendingTransfersRequest`,
  AxelarnetRegisterIBCPathRequest: `/${protobufPackage}.RegisterIBCPathRequest`,
  AxelarnetAddCosmosBasedChainRequest: `/${protobufPackage}.AddCosmosBasedChainRequest`,
  AxelarnetRegisterAssetRequest: `/${protobufPackage}.RegisterAssetRequest`,
  AxelarnetRouteIBCTransfersRequest: `/${protobufPackage}.RouteIBCTransfersRequest`,
  AxelarnetRegisterFeeCollectorRequest: `/${protobufPackage}.RegisterFeeCollectorRequest`,
} as const;

const AXELARNET_TYPE_PAIRS = [
  [TxTypeUrlMap.AxelarnetLinkRequest, LinkRequest],
  [TxTypeUrlMap.AxelarnetConfirmDepositRequest, ConfirmDepositRequest],
  [
    TxTypeUrlMap.AxelarnetExecutePendingTransfersRequest,
    ExecutePendingTransfersRequest,
  ],
  [TxTypeUrlMap.AxelarnetRegisterIBCPathRequest, RegisterIBCPathRequest],
  [
    TxTypeUrlMap.AxelarnetAddCosmosBasedChainRequest,
    AddCosmosBasedChainRequest,
  ],
  [TxTypeUrlMap.AxelarnetRegisterAssetRequest, RegisterAssetRequest],
  [TxTypeUrlMap.AxelarnetRouteIBCTransfersRequest, RouteIBCTransfersRequest],
  [
    TxTypeUrlMap.AxelarnetRegisterFeeCollectorRequest,
    RegisterFeeCollectorRequest,
  ],
] as const;

export function registerAxelarnetTxTypes(registry: Registry) {
  for (const [typeUrl, codec] of AXELARNET_TYPE_PAIRS) {
    registry.register(typeUrl, codec);
  }
}
