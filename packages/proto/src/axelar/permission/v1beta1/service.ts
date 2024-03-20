/* eslint-disable */
import _m0 from "protobufjs/minimal";

import {
  ParamsRequest,
  ParamsResponse,
  QueryGovernanceKeyRequest,
  QueryGovernanceKeyResponse,
} from "./query";
import {
  DeregisterControllerRequest,
  DeregisterControllerResponse,
  RegisterControllerRequest,
  RegisterControllerResponse,
  UpdateGovernanceKeyRequest,
  UpdateGovernanceKeyResponse,
} from "./tx";

export const protobufPackage = "axelar.permission.v1beta1";

/** Msg defines the gov Msg service. */
export interface Msg {
  RegisterController(
    request: RegisterControllerRequest,
  ): Promise<RegisterControllerResponse>;
  DeregisterController(
    request: DeregisterControllerRequest,
  ): Promise<DeregisterControllerResponse>;
  UpdateGovernanceKey(
    request: UpdateGovernanceKeyRequest,
  ): Promise<UpdateGovernanceKeyResponse>;
}

export const MsgServiceName = "axelar.permission.v1beta1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.RegisterController = this.RegisterController.bind(this);
    this.DeregisterController = this.DeregisterController.bind(this);
    this.UpdateGovernanceKey = this.UpdateGovernanceKey.bind(this);
  }
  RegisterController(
    request: RegisterControllerRequest,
  ): Promise<RegisterControllerResponse> {
    const data = RegisterControllerRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterController", data);
    return promise.then((data) =>
      RegisterControllerResponse.decode(_m0.Reader.create(data)),
    );
  }

  DeregisterController(
    request: DeregisterControllerRequest,
  ): Promise<DeregisterControllerResponse> {
    const data = DeregisterControllerRequest.encode(request).finish();
    const promise = this.rpc.request(
      this.service,
      "DeregisterController",
      data,
    );
    return promise.then((data) =>
      DeregisterControllerResponse.decode(_m0.Reader.create(data)),
    );
  }

  UpdateGovernanceKey(
    request: UpdateGovernanceKeyRequest,
  ): Promise<UpdateGovernanceKeyResponse> {
    const data = UpdateGovernanceKeyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateGovernanceKey", data);
    return promise.then((data) =>
      UpdateGovernanceKeyResponse.decode(_m0.Reader.create(data)),
    );
  }
}

/** Query defines the gRPC querier service. */
export interface Query {
  /** GovernanceKey returns the multisig governance key */
  GovernanceKey(
    request: QueryGovernanceKeyRequest,
  ): Promise<QueryGovernanceKeyResponse>;
  Params(request: ParamsRequest): Promise<ParamsResponse>;
}

export const QueryServiceName = "axelar.permission.v1beta1.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.GovernanceKey = this.GovernanceKey.bind(this);
    this.Params = this.Params.bind(this);
  }
  GovernanceKey(
    request: QueryGovernanceKeyRequest,
  ): Promise<QueryGovernanceKeyResponse> {
    const data = QueryGovernanceKeyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GovernanceKey", data);
    return promise.then((data) =>
      QueryGovernanceKeyResponse.decode(_m0.Reader.create(data)),
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
