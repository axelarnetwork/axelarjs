/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { RefundMsgRequest, RefundMsgResponse } from "./tx";

export const protobufPackage = "axelar.reward.v1beta1";

/** Msg defines the axelarnet Msg service. */
export interface MsgService {
  RefundMsg(request: RefundMsgRequest): Promise<RefundMsgResponse>;
}

export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "axelar.reward.v1beta1.MsgService";
    this.rpc = rpc;
    this.RefundMsg = this.RefundMsg.bind(this);
  }
  RefundMsg(request: RefundMsgRequest): Promise<RefundMsgResponse> {
    const data = RefundMsgRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RefundMsg", data);
    return promise.then((data) =>
      RefundMsgResponse.decode(new _m0.Reader(data))
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
