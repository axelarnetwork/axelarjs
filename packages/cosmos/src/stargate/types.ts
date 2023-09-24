import type { TsProtoGeneratedType } from "@cosmjs/proto-signing";

export type CamelCase<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : never;

export type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<K & string>]: T[K];
};

export type SimplifyRequestMethod<T> = T extends `${infer First}Request`
  ? CamelCase<First>
  : T extends `${string}Response` | `${string}Impl`
  ? never
  : T extends `Msg${infer First}`
  ? CamelCase<First>
  : never;

export type KeepOnlySimplifiedRequestMethods<T> = {
  [K in keyof T as SimplifyRequestMethod<K & string>]: T[K];
};

export type PickType<TObject, TPicked> = Pick<
  TObject,
  Exclude<
    keyof TObject,
    {
      [P in keyof TObject]: TObject[P] extends TPicked ? never : P;
    }[keyof TObject]
  >
>;

export type ProtoPackageAndMessages<T extends { protobufPackage: string }> = {
  protobufPackage: T["protobufPackage"];
} & PickType<T, TsProtoGeneratedType>;

export type EncodeProtoPackage<T extends ProtoPackageAndMessages<T>> = {
  [P in keyof PickType<T, TsProtoGeneratedType> as P extends string
    ? `${T["protobufPackage"]}.${P}`
    : never]: {
    typeUrl: P extends string ? `/${T["protobufPackage"]}.${P}` : void;
    value: T[P] extends TsProtoGeneratedType
      ? ReturnType<T[P]["fromPartial"]>
      : void;
  };
};

export type Rpc = {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
};

export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;
