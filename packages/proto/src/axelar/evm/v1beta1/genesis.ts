/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

import { QueueState } from "../../utils/v1beta1/queuer";
import { Params } from "./params";
import {
  BurnerInfo,
  CommandBatchMetadata,
  ERC20Deposit,
  ERC20TokenMetadata,
  Event,
  Gateway,
} from "./types";

export const protobufPackage = "axelar.evm.v1beta1";

/** GenesisState represents the genesis state */
export interface GenesisState {
  chains: GenesisState_Chain[];
}

export interface GenesisState_Chain {
  params?: Params | undefined;
  burnerInfos: BurnerInfo[];
  commandQueue?: QueueState | undefined;
  confirmedDeposits: ERC20Deposit[];
  burnedDeposits: ERC20Deposit[];
  commandBatches: CommandBatchMetadata[];
  gateway?: Gateway | undefined;
  tokens: ERC20TokenMetadata[];
  events: Event[];
  confirmedEventQueue?: QueueState | undefined;
  legacyConfirmedDeposits: ERC20Deposit[];
  legacyBurnedDeposits: ERC20Deposit[];
}

function createBaseGenesisState(): GenesisState {
  return { chains: [] };
}

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.chains) {
      GenesisState_Chain.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          if (tag !== 26) {
            break;
          }

          message.chains.push(
            GenesisState_Chain.decode(reader, reader.uint32())
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      chains: Array.isArray(object?.chains)
        ? object.chains.map((e: any) => GenesisState_Chain.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    if (message.chains?.length) {
      obj.chains = message.chains.map((e) => GenesisState_Chain.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState>, I>>(
    base?: I
  ): GenesisState {
    return GenesisState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
    object: I
  ): GenesisState {
    const message = createBaseGenesisState();
    message.chains =
      object.chains?.map((e) => GenesisState_Chain.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGenesisState_Chain(): GenesisState_Chain {
  return {
    params: undefined,
    burnerInfos: [],
    commandQueue: undefined,
    confirmedDeposits: [],
    burnedDeposits: [],
    commandBatches: [],
    gateway: undefined,
    tokens: [],
    events: [],
    confirmedEventQueue: undefined,
    legacyConfirmedDeposits: [],
    legacyBurnedDeposits: [],
  };
}

export const GenesisState_Chain = {
  encode(
    message: GenesisState_Chain,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.burnerInfos) {
      BurnerInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.commandQueue !== undefined) {
      QueueState.encode(
        message.commandQueue,
        writer.uint32(26).fork()
      ).ldelim();
    }
    for (const v of message.confirmedDeposits) {
      ERC20Deposit.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.burnedDeposits) {
      ERC20Deposit.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.commandBatches) {
      CommandBatchMetadata.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.gateway !== undefined) {
      Gateway.encode(message.gateway, writer.uint32(74).fork()).ldelim();
    }
    for (const v of message.tokens) {
      ERC20TokenMetadata.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    for (const v of message.events) {
      Event.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (message.confirmedEventQueue !== undefined) {
      QueueState.encode(
        message.confirmedEventQueue,
        writer.uint32(98).fork()
      ).ldelim();
    }
    for (const v of message.legacyConfirmedDeposits) {
      ERC20Deposit.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    for (const v of message.legacyBurnedDeposits) {
      ERC20Deposit.encode(v!, writer.uint32(114).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState_Chain {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState_Chain();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.burnerInfos.push(BurnerInfo.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.commandQueue = QueueState.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.confirmedDeposits.push(
            ERC20Deposit.decode(reader, reader.uint32())
          );
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.burnedDeposits.push(
            ERC20Deposit.decode(reader, reader.uint32())
          );
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.commandBatches.push(
            CommandBatchMetadata.decode(reader, reader.uint32())
          );
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.gateway = Gateway.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.tokens.push(
            ERC20TokenMetadata.decode(reader, reader.uint32())
          );
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.events.push(Event.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.confirmedEventQueue = QueueState.decode(
            reader,
            reader.uint32()
          );
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.legacyConfirmedDeposits.push(
            ERC20Deposit.decode(reader, reader.uint32())
          );
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.legacyBurnedDeposits.push(
            ERC20Deposit.decode(reader, reader.uint32())
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenesisState_Chain {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      burnerInfos: Array.isArray(object?.burnerInfos)
        ? object.burnerInfos.map((e: any) => BurnerInfo.fromJSON(e))
        : [],
      commandQueue: isSet(object.commandQueue)
        ? QueueState.fromJSON(object.commandQueue)
        : undefined,
      confirmedDeposits: Array.isArray(object?.confirmedDeposits)
        ? object.confirmedDeposits.map((e: any) => ERC20Deposit.fromJSON(e))
        : [],
      burnedDeposits: Array.isArray(object?.burnedDeposits)
        ? object.burnedDeposits.map((e: any) => ERC20Deposit.fromJSON(e))
        : [],
      commandBatches: Array.isArray(object?.commandBatches)
        ? object.commandBatches.map((e: any) =>
            CommandBatchMetadata.fromJSON(e)
          )
        : [],
      gateway: isSet(object.gateway)
        ? Gateway.fromJSON(object.gateway)
        : undefined,
      tokens: Array.isArray(object?.tokens)
        ? object.tokens.map((e: any) => ERC20TokenMetadata.fromJSON(e))
        : [],
      events: Array.isArray(object?.events)
        ? object.events.map((e: any) => Event.fromJSON(e))
        : [],
      confirmedEventQueue: isSet(object.confirmedEventQueue)
        ? QueueState.fromJSON(object.confirmedEventQueue)
        : undefined,
      legacyConfirmedDeposits: Array.isArray(object?.legacyConfirmedDeposits)
        ? object.legacyConfirmedDeposits.map((e: any) =>
            ERC20Deposit.fromJSON(e)
          )
        : [],
      legacyBurnedDeposits: Array.isArray(object?.legacyBurnedDeposits)
        ? object.legacyBurnedDeposits.map((e: any) => ERC20Deposit.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState_Chain): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    if (message.burnerInfos?.length) {
      obj.burnerInfos = message.burnerInfos.map((e) => BurnerInfo.toJSON(e));
    }
    if (message.commandQueue !== undefined) {
      obj.commandQueue = QueueState.toJSON(message.commandQueue);
    }
    if (message.confirmedDeposits?.length) {
      obj.confirmedDeposits = message.confirmedDeposits.map((e) =>
        ERC20Deposit.toJSON(e)
      );
    }
    if (message.burnedDeposits?.length) {
      obj.burnedDeposits = message.burnedDeposits.map((e) =>
        ERC20Deposit.toJSON(e)
      );
    }
    if (message.commandBatches?.length) {
      obj.commandBatches = message.commandBatches.map((e) =>
        CommandBatchMetadata.toJSON(e)
      );
    }
    if (message.gateway !== undefined) {
      obj.gateway = Gateway.toJSON(message.gateway);
    }
    if (message.tokens?.length) {
      obj.tokens = message.tokens.map((e) => ERC20TokenMetadata.toJSON(e));
    }
    if (message.events?.length) {
      obj.events = message.events.map((e) => Event.toJSON(e));
    }
    if (message.confirmedEventQueue !== undefined) {
      obj.confirmedEventQueue = QueueState.toJSON(message.confirmedEventQueue);
    }
    if (message.legacyConfirmedDeposits?.length) {
      obj.legacyConfirmedDeposits = message.legacyConfirmedDeposits.map((e) =>
        ERC20Deposit.toJSON(e)
      );
    }
    if (message.legacyBurnedDeposits?.length) {
      obj.legacyBurnedDeposits = message.legacyBurnedDeposits.map((e) =>
        ERC20Deposit.toJSON(e)
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState_Chain>, I>>(
    base?: I
  ): GenesisState_Chain {
    return GenesisState_Chain.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenesisState_Chain>, I>>(
    object: I
  ): GenesisState_Chain {
    const message = createBaseGenesisState_Chain();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    message.burnerInfos =
      object.burnerInfos?.map((e) => BurnerInfo.fromPartial(e)) || [];
    message.commandQueue =
      object.commandQueue !== undefined && object.commandQueue !== null
        ? QueueState.fromPartial(object.commandQueue)
        : undefined;
    message.confirmedDeposits =
      object.confirmedDeposits?.map((e) => ERC20Deposit.fromPartial(e)) || [];
    message.burnedDeposits =
      object.burnedDeposits?.map((e) => ERC20Deposit.fromPartial(e)) || [];
    message.commandBatches =
      object.commandBatches?.map((e) => CommandBatchMetadata.fromPartial(e)) ||
      [];
    message.gateway =
      object.gateway !== undefined && object.gateway !== null
        ? Gateway.fromPartial(object.gateway)
        : undefined;
    message.tokens =
      object.tokens?.map((e) => ERC20TokenMetadata.fromPartial(e)) || [];
    message.events = object.events?.map((e) => Event.fromPartial(e)) || [];
    message.confirmedEventQueue =
      object.confirmedEventQueue !== undefined &&
      object.confirmedEventQueue !== null
        ? QueueState.fromPartial(object.confirmedEventQueue)
        : undefined;
    message.legacyConfirmedDeposits =
      object.legacyConfirmedDeposits?.map((e) => ERC20Deposit.fromPartial(e)) ||
      [];
    message.legacyBurnedDeposits =
      object.legacyBurnedDeposits?.map((e) => ERC20Deposit.fromPartial(e)) ||
      [];
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
