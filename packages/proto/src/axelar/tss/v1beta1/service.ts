/* eslint-disable */
import _m0 from "protobufjs/minimal";

import { ParamsRequest, ParamsResponse } from "./query";
import { HeartBeatRequest, HeartBeatResponse } from "./tx";

export const protobufPackage = "axelar.tss.v1beta1";

/** Msg defines the tss Msg service. */
export interface MsgService {
  HeartBeat(request: HeartBeatRequest): Promise<HeartBeatResponse>;
}

export const MsgServiceServiceName = "axelar.tss.v1beta1.MsgService";
export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceServiceName;
    this.rpc = rpc;
    this.HeartBeat = this.HeartBeat.bind(this);
  }
  HeartBeat(request: HeartBeatRequest): Promise<HeartBeatResponse> {
    const data = HeartBeatRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "HeartBeat", data);
    return promise.then((data) =>
      HeartBeatResponse.decode(_m0.Reader.create(data))
    );
  }
}

/** Query defines the gRPC querier service. */
export interface QueryService {
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceServiceName = "axelar.tss.v1beta1.QueryService";
export class QueryServiceClientImpl implements QueryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceServiceName;
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
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
