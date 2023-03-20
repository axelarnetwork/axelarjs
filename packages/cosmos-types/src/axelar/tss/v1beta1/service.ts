/* eslint-disable */
import _m0 from "protobufjs/minimal";

import { HeartBeatRequest, HeartBeatResponse } from "./tx";

export const protobufPackage = "axelar.tss.v1beta1";

/** Msg defines the tss Msg service. */
export interface MsgService {
  HeartBeat(request: HeartBeatRequest): Promise<HeartBeatResponse>;
}

export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.tss.v1beta1.MsgService";
    this.rpc = rpc;
    this.HeartBeat = this.HeartBeat.bind(this);
  }
  HeartBeat(request: HeartBeatRequest): Promise<HeartBeatResponse> {
    const data = HeartBeatRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "HeartBeat", data);
    return promise.then((data) =>
      HeartBeatResponse.decode(new _m0.Reader(data))
    );
  }
}

/** Query defines the gRPC querier service. */
export interface QueryService {}

export class QueryServiceClientImpl implements QueryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.tss.v1beta1.QueryService";
    this.rpc = rpc;
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}
