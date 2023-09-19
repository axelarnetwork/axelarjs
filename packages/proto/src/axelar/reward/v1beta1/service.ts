/* eslint-disable */
import _m0 from "protobufjs/minimal";

import {
  InflationRateRequest,
  InflationRateResponse,
  ParamsRequest,
  ParamsResponse,
} from "./query";
import { RefundMsgRequest, RefundMsgResponse } from "./tx";

export const protobufPackage = "axelar.reward.v1beta1";

/** Msg defines the axelarnet Msg service. */
export interface MsgService {
  RefundMsg(request: RefundMsgRequest): Promise<RefundMsgResponse>;
}

export const MsgServiceServiceName = "axelar.reward.v1beta1.MsgService";
export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceServiceName;
    this.rpc = rpc;
    this.RefundMsg = this.RefundMsg.bind(this);
  }
  RefundMsg(request: RefundMsgRequest): Promise<RefundMsgResponse> {
    const data = RefundMsgRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RefundMsg", data);
    return promise.then((data) =>
      RefundMsgResponse.decode(_m0.Reader.create(data))
    );
  }
}

/** QueryService defines the gRPC querier service. */
export interface QueryService {
  InflationRate(request: InflationRateRequest): Promise<InflationRateResponse>;
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceServiceName = "axelar.reward.v1beta1.QueryService";
export class QueryServiceClientImpl implements QueryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceServiceName;
    this.rpc = rpc;
    this.InflationRate = this.InflationRate.bind(this);
    this.Params = this.Params.bind(this);
  }
  InflationRate(request: InflationRateRequest): Promise<InflationRateResponse> {
    const data = InflationRateRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "InflationRate", data);
    return promise.then((data) =>
      InflationRateResponse.decode(_m0.Reader.create(data))
    );
  }

  Params(request: ParamsRequest): Promise<ParamsResponse> {
    const data = ParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) =>
      ParamsResponse.decode(_m0.Reader.create(data))
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
