/* eslint-disable */
import _m0 from "protobufjs/minimal";

import { ParamsRequest, ParamsResponse } from "./query";
import { VoteRequest, VoteResponse } from "./tx";

export const protobufPackage = "axelar.vote.v1beta1";

/** Msg defines the vote Msg service. */
export interface MsgService {
  Vote(request: VoteRequest): Promise<VoteResponse>;
}

export const MsgServiceServiceName = "axelar.vote.v1beta1.MsgService";
export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceServiceName;
    this.rpc = rpc;
    this.Vote = this.Vote.bind(this);
  }
  Vote(request: VoteRequest): Promise<VoteResponse> {
    const data = VoteRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Vote", data);
    return promise.then((data) => VoteResponse.decode(_m0.Reader.create(data)));
  }
}

/** QueryService defines the gRPC querier service. */
export interface QueryService {
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceServiceName = "axelar.vote.v1beta1.QueryService";
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
