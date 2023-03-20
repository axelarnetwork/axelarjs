/* eslint-disable */
import _m0 from "protobufjs/minimal";

import { VoteRequest, VoteResponse } from "./tx";

export const protobufPackage = "axelar.vote.v1beta1";

/** Msg defines the vote Msg service. */
export interface MsgService {
  Vote(request: VoteRequest): Promise<VoteResponse>;
}

export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.vote.v1beta1.MsgService";
    this.rpc = rpc;
    this.Vote = this.Vote.bind(this);
  }
  Vote(request: VoteRequest): Promise<VoteResponse> {
    const data = VoteRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Vote", data);
    return promise.then((data) => VoteResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}
