/* eslint-disable */
import _m0 from "protobufjs/minimal";
import {
  PendingIBCTransferCountRequest,
  PendingIBCTransferCountResponse,
} from "./query";
import {
  AddCosmosBasedChainRequest,
  AddCosmosBasedChainResponse,
  CallContractRequest,
  CallContractResponse,
  ConfirmDepositRequest,
  ConfirmDepositResponse,
  ExecuteMessageRequest,
  ExecuteMessageResponse,
  ExecutePendingTransfersRequest,
  ExecutePendingTransfersResponse,
  LinkRequest,
  LinkResponse,
  RegisterAssetRequest,
  RegisterAssetResponse,
  RegisterFeeCollectorRequest,
  RegisterFeeCollectorResponse,
  RetryIBCTransferRequest,
  RetryIBCTransferResponse,
  RouteIBCTransfersRequest,
  RouteIBCTransfersResponse,
} from "./tx";

export const protobufPackage = "axelar.axelarnet.v1beta1";

/** Msg defines the axelarnet Msg service. */
export interface MsgService {
  Link(request: LinkRequest): Promise<LinkResponse>;
  ConfirmDeposit(
    request: ConfirmDepositRequest
  ): Promise<ConfirmDepositResponse>;
  ExecutePendingTransfers(
    request: ExecutePendingTransfersRequest
  ): Promise<ExecutePendingTransfersResponse>;
  AddCosmosBasedChain(
    request: AddCosmosBasedChainRequest
  ): Promise<AddCosmosBasedChainResponse>;
  RegisterAsset(request: RegisterAssetRequest): Promise<RegisterAssetResponse>;
  RouteIBCTransfers(
    request: RouteIBCTransfersRequest
  ): Promise<RouteIBCTransfersResponse>;
  RegisterFeeCollector(
    request: RegisterFeeCollectorRequest
  ): Promise<RegisterFeeCollectorResponse>;
  RetryIBCTransfer(
    request: RetryIBCTransferRequest
  ): Promise<RetryIBCTransferResponse>;
  ExecuteMessage(
    request: ExecuteMessageRequest
  ): Promise<ExecuteMessageResponse>;
  CallContract(request: CallContractRequest): Promise<CallContractResponse>;
}

export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.axelarnet.v1beta1.MsgService";
    this.rpc = rpc;
    this.Link = this.Link.bind(this);
    this.ConfirmDeposit = this.ConfirmDeposit.bind(this);
    this.ExecutePendingTransfers = this.ExecutePendingTransfers.bind(this);
    this.AddCosmosBasedChain = this.AddCosmosBasedChain.bind(this);
    this.RegisterAsset = this.RegisterAsset.bind(this);
    this.RouteIBCTransfers = this.RouteIBCTransfers.bind(this);
    this.RegisterFeeCollector = this.RegisterFeeCollector.bind(this);
    this.RetryIBCTransfer = this.RetryIBCTransfer.bind(this);
    this.ExecuteMessage = this.ExecuteMessage.bind(this);
    this.CallContract = this.CallContract.bind(this);
  }
  Link(request: LinkRequest): Promise<LinkResponse> {
    const data = LinkRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Link", data);
    return promise.then((data) => LinkResponse.decode(new _m0.Reader(data)));
  }

  ConfirmDeposit(
    request: ConfirmDepositRequest
  ): Promise<ConfirmDepositResponse> {
    const data = ConfirmDepositRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ConfirmDeposit", data);
    return promise.then((data) =>
      ConfirmDepositResponse.decode(new _m0.Reader(data))
    );
  }

  ExecutePendingTransfers(
    request: ExecutePendingTransfersRequest
  ): Promise<ExecutePendingTransfersResponse> {
    const data = ExecutePendingTransfersRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "ExecutePendingTransfers",
      data
    );
    return promise.then((data) =>
      ExecutePendingTransfersResponse.decode(new _m0.Reader(data))
    );
  }

  AddCosmosBasedChain(
    request: AddCosmosBasedChainRequest
  ): Promise<AddCosmosBasedChainResponse> {
    const data = AddCosmosBasedChainRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddCosmosBasedChain", data);
    return promise.then((data) =>
      AddCosmosBasedChainResponse.decode(new _m0.Reader(data))
    );
  }

  RegisterAsset(request: RegisterAssetRequest): Promise<RegisterAssetResponse> {
    const data = RegisterAssetRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterAsset", data);
    return promise.then((data) =>
      RegisterAssetResponse.decode(new _m0.Reader(data))
    );
  }

  RouteIBCTransfers(
    request: RouteIBCTransfersRequest
  ): Promise<RouteIBCTransfersResponse> {
    const data = RouteIBCTransfersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RouteIBCTransfers", data);
    return promise.then((data) =>
      RouteIBCTransfersResponse.decode(new _m0.Reader(data))
    );
  }

  RegisterFeeCollector(
    request: RegisterFeeCollectorRequest
  ): Promise<RegisterFeeCollectorResponse> {
    const data = RegisterFeeCollectorRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "RegisterFeeCollector",
      data
    );
    return promise.then((data) =>
      RegisterFeeCollectorResponse.decode(new _m0.Reader(data))
    );
  }

  RetryIBCTransfer(
    request: RetryIBCTransferRequest
  ): Promise<RetryIBCTransferResponse> {
    const data = RetryIBCTransferRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RetryIBCTransfer", data);
    return promise.then((data) =>
      RetryIBCTransferResponse.decode(new _m0.Reader(data))
    );
  }

  ExecuteMessage(
    request: ExecuteMessageRequest
  ): Promise<ExecuteMessageResponse> {
    const data = ExecuteMessageRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ExecuteMessage", data);
    return promise.then((data) =>
      ExecuteMessageResponse.decode(new _m0.Reader(data))
    );
  }

  CallContract(request: CallContractRequest): Promise<CallContractResponse> {
    const data = CallContractRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CallContract", data);
    return promise.then((data) =>
      CallContractResponse.decode(new _m0.Reader(data))
    );
  }
}

/** QueryService defines the gRPC querier service. */
export interface QueryService {
  /** PendingIBCTransferCount queries the pending ibc transfers for all chains */
  PendingIBCTransferCount(
    request: PendingIBCTransferCountRequest
  ): Promise<PendingIBCTransferCountResponse>;
}

export class QueryServiceClientImpl implements QueryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.axelarnet.v1beta1.QueryService";
    this.rpc = rpc;
    this.PendingIBCTransferCount = this.PendingIBCTransferCount.bind(this);
  }
  PendingIBCTransferCount(
    request: PendingIBCTransferCountRequest
  ): Promise<PendingIBCTransferCountResponse> {
    const data = PendingIBCTransferCountRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "PendingIBCTransferCount",
      data
    );
    return promise.then((data) =>
      PendingIBCTransferCountResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}
