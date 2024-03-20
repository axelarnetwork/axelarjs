/* eslint-disable */
import _m0 from "protobufjs/minimal";

import { ParamsRequest, ParamsResponse } from "./query";
import {
  DeactivateProxyRequest,
  DeactivateProxyResponse,
  RegisterProxyRequest,
  RegisterProxyResponse,
} from "./tx";

export const protobufPackage = "axelar.snapshot.v1beta1";

/** Msg defines the snapshot Msg service. */
export interface MsgService {
  /**
   * RegisterProxy defines a method for registering a proxy account that can act
   * in a validator account's stead.
   */
  RegisterProxy(request: RegisterProxyRequest): Promise<RegisterProxyResponse>;
  /** DeactivateProxy defines a method for deregistering a proxy account. */
  DeactivateProxy(
    request: DeactivateProxyRequest,
  ): Promise<DeactivateProxyResponse>;
}

export const MsgServiceServiceName = "axelar.snapshot.v1beta1.MsgService";
export class MsgServiceClientImpl implements MsgService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceServiceName;
    this.rpc = rpc;
    this.RegisterProxy = this.RegisterProxy.bind(this);
    this.DeactivateProxy = this.DeactivateProxy.bind(this);
  }
  RegisterProxy(request: RegisterProxyRequest): Promise<RegisterProxyResponse> {
    const data = RegisterProxyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterProxy", data);
    return promise.then((data) =>
      RegisterProxyResponse.decode(_m0.Reader.create(data)),
    );
  }

  DeactivateProxy(
    request: DeactivateProxyRequest,
  ): Promise<DeactivateProxyResponse> {
    const data = DeactivateProxyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeactivateProxy", data);
    return promise.then((data) =>
      DeactivateProxyResponse.decode(_m0.Reader.create(data)),
    );
  }
}

/** QueryService defines the gRPC querier service. */
export interface QueryService {
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceServiceName = "axelar.snapshot.v1beta1.QueryService";
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
