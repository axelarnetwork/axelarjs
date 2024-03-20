/* eslint-disable */
import _m0 from "protobufjs/minimal";

import {
  AssetsRequest,
  AssetsResponse,
  ChainMaintainersRequest,
  ChainMaintainersResponse,
  ChainsByAssetRequest,
  ChainsByAssetResponse,
  ChainsRequest,
  ChainsResponse,
  ChainStateRequest,
  ChainStateResponse,
  FeeInfoRequest,
  FeeInfoResponse,
  LatestDepositAddressRequest,
  LatestDepositAddressResponse,
  MessageRequest,
  MessageResponse,
  ParamsRequest,
  ParamsResponse,
  RecipientAddressRequest,
  RecipientAddressResponse,
  TransferFeeRequest,
  TransferFeeResponse,
  TransferRateLimitRequest,
  TransferRateLimitResponse,
  TransfersForChainRequest,
  TransfersForChainResponse,
} from "./query";
import {
  ActivateChainRequest,
  ActivateChainResponse,
  DeactivateChainRequest,
  DeactivateChainResponse,
  DeregisterChainMaintainerRequest,
  DeregisterChainMaintainerResponse,
  RegisterAssetFeeRequest,
  RegisterAssetFeeResponse,
  RegisterChainMaintainerRequest,
  RegisterChainMaintainerResponse,
  SetTransferRateLimitRequest,
  SetTransferRateLimitResponse,
} from "./tx";

export const protobufPackage = "axelar.nexus.v1beta1";

/** Msg defines the nexus Msg service. */
export interface MsgService {
  RegisterChainMaintainer(
    request: RegisterChainMaintainerRequest,
  ): Promise<RegisterChainMaintainerResponse>;
  DeregisterChainMaintainer(
    request: DeregisterChainMaintainerRequest,
  ): Promise<DeregisterChainMaintainerResponse>;
  ActivateChain(request: ActivateChainRequest): Promise<ActivateChainResponse>;
  DeactivateChain(
    request: DeactivateChainRequest,
  ): Promise<DeactivateChainResponse>;
  RegisterAssetFee(
    request: RegisterAssetFeeRequest,
  ): Promise<RegisterAssetFeeResponse>;
  SetTransferRateLimit(
    request: SetTransferRateLimitRequest,
  ): Promise<SetTransferRateLimitResponse>;
}

export const MsgServiceServiceName = "axelar.nexus.v1beta1.MsgService";
export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceServiceName;
    this.rpc = rpc;
    this.RegisterChainMaintainer = this.RegisterChainMaintainer.bind(this);
    this.DeregisterChainMaintainer = this.DeregisterChainMaintainer.bind(this);
    this.ActivateChain = this.ActivateChain.bind(this);
    this.DeactivateChain = this.DeactivateChain.bind(this);
    this.RegisterAssetFee = this.RegisterAssetFee.bind(this);
    this.SetTransferRateLimit = this.SetTransferRateLimit.bind(this);
  }
  RegisterChainMaintainer(
    request: RegisterChainMaintainerRequest,
  ): Promise<RegisterChainMaintainerResponse> {
    const data = RegisterChainMaintainerRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "RegisterChainMaintainer",
      data,
    );
    return promise.then((data) =>
      RegisterChainMaintainerResponse.decode(_m0.Reader.create(data)),
    );
  }

  DeregisterChainMaintainer(
    request: DeregisterChainMaintainerRequest,
  ): Promise<DeregisterChainMaintainerResponse> {
    const data = DeregisterChainMaintainerRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "DeregisterChainMaintainer",
      data,
    );
    return promise.then((data) =>
      DeregisterChainMaintainerResponse.decode(_m0.Reader.create(data)),
    );
  }

  ActivateChain(request: ActivateChainRequest): Promise<ActivateChainResponse> {
    const data = ActivateChainRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ActivateChain", data);
    return promise.then((data) =>
      ActivateChainResponse.decode(_m0.Reader.create(data)),
    );
  }

  DeactivateChain(
    request: DeactivateChainRequest,
  ): Promise<DeactivateChainResponse> {
    const data = DeactivateChainRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeactivateChain", data);
    return promise.then((data) =>
      DeactivateChainResponse.decode(_m0.Reader.create(data)),
    );
  }

  RegisterAssetFee(
    request: RegisterAssetFeeRequest,
  ): Promise<RegisterAssetFeeResponse> {
    const data = RegisterAssetFeeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterAssetFee", data);
    return promise.then((data) =>
      RegisterAssetFeeResponse.decode(_m0.Reader.create(data)),
    );
  }

  SetTransferRateLimit(
    request: SetTransferRateLimitRequest,
  ): Promise<SetTransferRateLimitResponse> {
    const data = SetTransferRateLimitRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "SetTransferRateLimit",
      data,
    );
    return promise.then((data) =>
      SetTransferRateLimitResponse.decode(_m0.Reader.create(data)),
    );
  }
}

/** QueryService defines the gRPC querier service. */
export interface QueryService {
  /** LatestDepositAddress queries the a deposit address by recipient */
  LatestDepositAddress(
    request: LatestDepositAddressRequest,
  ): Promise<LatestDepositAddressResponse>;
  /** TransfersForChain queries transfers by chain */
  TransfersForChain(
    request: TransfersForChainRequest,
  ): Promise<TransfersForChainResponse>;
  /** FeeInfo queries the fee info by chain and asset */
  FeeInfo(request: FeeInfoRequest): Promise<FeeInfoResponse>;
  /**
   * TransferFee queries the transfer fee by the source, destination chain,
   * and amount. If amount is 0, the min fee is returned
   */
  TransferFee(request: TransferFeeRequest): Promise<TransferFeeResponse>;
  /** Chains queries the chains registered on the network */
  Chains(request: ChainsRequest): Promise<ChainsResponse>;
  /** Assets queries the assets registered for a chain */
  Assets(request: AssetsRequest): Promise<AssetsResponse>;
  /** ChainState queries the state of a registered chain on the network */
  ChainState(request: ChainStateRequest): Promise<ChainStateResponse>;
  /** ChainsByAsset queries the chains that support an asset on the network */
  ChainsByAsset(request: ChainsByAssetRequest): Promise<ChainsByAssetResponse>;
  /** RecipientAddress queries the recipient address for a given deposit address */
  RecipientAddress(
    request: RecipientAddressRequest,
  ): Promise<RecipientAddressResponse>;
  /** ChainMaintainers queries the chain maintainers for a given chain */
  ChainMaintainers(
    request: ChainMaintainersRequest,
  ): Promise<ChainMaintainersResponse>;
  /**
   * TransferRateLimit queries the transfer rate limit for a given chain and
   * asset. If a rate limit is not set, nil is returned.
   */
  TransferRateLimit(
    request: TransferRateLimitRequest,
  ): Promise<TransferRateLimitResponse>;
  Message(request: MessageRequest): Promise<MessageResponse>;
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceServiceName = "axelar.nexus.v1beta1.QueryService";
export class QueryServiceClientImpl implements QueryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceServiceName;
    this.rpc = rpc;
    this.LatestDepositAddress = this.LatestDepositAddress.bind(this);
    this.TransfersForChain = this.TransfersForChain.bind(this);
    this.FeeInfo = this.FeeInfo.bind(this);
    this.TransferFee = this.TransferFee.bind(this);
    this.Chains = this.Chains.bind(this);
    this.Assets = this.Assets.bind(this);
    this.ChainState = this.ChainState.bind(this);
    this.ChainsByAsset = this.ChainsByAsset.bind(this);
    this.RecipientAddress = this.RecipientAddress.bind(this);
    this.ChainMaintainers = this.ChainMaintainers.bind(this);
    this.TransferRateLimit = this.TransferRateLimit.bind(this);
    this.Message = this.Message.bind(this);
    this.Params = this.Params.bind(this);
  }
  LatestDepositAddress(
    request: LatestDepositAddressRequest,
  ): Promise<LatestDepositAddressResponse> {
    const data = LatestDepositAddressRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "LatestDepositAddress",
      data,
    );
    return promise.then((data) =>
      LatestDepositAddressResponse.decode(_m0.Reader.create(data)),
    );
  }

  TransfersForChain(
    request: TransfersForChainRequest,
  ): Promise<TransfersForChainResponse> {
    const data = TransfersForChainRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "TransfersForChain", data);
    return promise.then((data) =>
      TransfersForChainResponse.decode(_m0.Reader.create(data)),
    );
  }

  FeeInfo(request: FeeInfoRequest): Promise<FeeInfoResponse> {
    const data = FeeInfoRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "FeeInfo", data);
    return promise.then((data) =>
      FeeInfoResponse.decode(_m0.Reader.create(data)),
    );
  }

  TransferFee(request: TransferFeeRequest): Promise<TransferFeeResponse> {
    const data = TransferFeeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "TransferFee", data);
    return promise.then((data) =>
      TransferFeeResponse.decode(_m0.Reader.create(data)),
    );
  }

  Chains(request: ChainsRequest): Promise<ChainsResponse> {
    const data = ChainsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Chains", data);
    return promise.then((data) =>
      ChainsResponse.decode(_m0.Reader.create(data)),
    );
  }

  Assets(request: AssetsRequest): Promise<AssetsResponse> {
    const data = AssetsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Assets", data);
    return promise.then((data) =>
      AssetsResponse.decode(_m0.Reader.create(data)),
    );
  }

  ChainState(request: ChainStateRequest): Promise<ChainStateResponse> {
    const data = ChainStateRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ChainState", data);
    return promise.then((data) =>
      ChainStateResponse.decode(_m0.Reader.create(data)),
    );
  }

  ChainsByAsset(request: ChainsByAssetRequest): Promise<ChainsByAssetResponse> {
    const data = ChainsByAssetRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ChainsByAsset", data);
    return promise.then((data) =>
      ChainsByAssetResponse.decode(_m0.Reader.create(data)),
    );
  }

  RecipientAddress(
    request: RecipientAddressRequest,
  ): Promise<RecipientAddressResponse> {
    const data = RecipientAddressRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RecipientAddress", data);
    return promise.then((data) =>
      RecipientAddressResponse.decode(_m0.Reader.create(data)),
    );
  }

  ChainMaintainers(
    request: ChainMaintainersRequest,
  ): Promise<ChainMaintainersResponse> {
    const data = ChainMaintainersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ChainMaintainers", data);
    return promise.then((data) =>
      ChainMaintainersResponse.decode(_m0.Reader.create(data)),
    );
  }

  TransferRateLimit(
    request: TransferRateLimitRequest,
  ): Promise<TransferRateLimitResponse> {
    const data = TransferRateLimitRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "TransferRateLimit", data);
    return promise.then((data) =>
      TransferRateLimitResponse.decode(_m0.Reader.create(data)),
    );
  }

  Message(request: MessageRequest): Promise<MessageResponse> {
    const data = MessageRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Message", data);
    return promise.then((data) =>
      MessageResponse.decode(_m0.Reader.create(data)),
    );
  }

  Params(request: ParamsRequest): Promise<ParamsResponse> {
    const data = ParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) =>
      ParamsResponse.decode(_m0.Reader.create(data)),
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array,
  ): Promise<Uint8Array>;
}
