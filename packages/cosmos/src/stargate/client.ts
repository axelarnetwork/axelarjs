import {
  GeneratedType,
  isTsProtoGeneratedType,
  OfflineSigner,
  Registry,
} from "@cosmjs/proto-signing";
import {
  AminoConverter,
  AminoConverters,
  AminoTypes,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFeegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
  defaultRegistryTypes,
  HttpEndpoint,
  SignerData,
  SigningStargateClient,
  SigningStargateClientOptions,
  StargateClient,
  StargateClientOptions,
  StdFee,
} from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import type { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { STANDARD_GAS_PRICE } from "../constants";
import {
  AxelarEncodeObject,
  AxelarMsgClient,
  CosmosEncodeObject,
  createMsgClient,
  MODULES,
} from "./messages";
import {
  convertToCamelCaseDeep,
  convertToSnakeCaseDeep,
  createAminoTypeNameFromProtoTypeUrl,
} from "./utils";

type ProtobufModule = Record<string, unknown> & {
  protobufPackage: string;
};

export const generateTypeUrlAndTypeRecords = (proto: ProtobufModule) =>
  Object.entries(proto)
    .filter(([, value]) => isTsProtoGeneratedType(value as GeneratedType))
    .map(([key, value]) => ({
      typeUrl: `/${proto.protobufPackage}.${key}`,
      type: value as GeneratedType,
    }));

export const createAxelarAminoConverters = (): AminoConverters =>
  Object.fromEntries<AminoConverter>(
    MODULES.flatMap(generateTypeUrlAndTypeRecords).map((proto) => [
      proto.typeUrl,
      {
        aminoType: createAminoTypeNameFromProtoTypeUrl(proto.typeUrl),
        toAmino: convertToSnakeCaseDeep,
        fromAmino: convertToCamelCaseDeep,
      },
    ])
  );

export const createDefaultRegistry = (defaultTypes = defaultRegistryTypes) => {
  const registry = new Registry(defaultTypes);
  MODULES.flatMap(generateTypeUrlAndTypeRecords).forEach((x) =>
    registry.register(x.typeUrl, x.type)
  );
  return registry;
};

export const createDefaultAminoTypes = () =>
  new AminoTypes({
    ...createAuthzAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(),
    ...createIbcAminoConverters(),
    ...createFeegrantAminoConverters(),
    ...createAxelarAminoConverters(),
  });

export function getSigningAxelarClientOptions(
  defaultTypes = defaultRegistryTypes
) {
  return {
    registry: createDefaultRegistry(defaultTypes),
    aminoTypes: createDefaultAminoTypes(),
  };
}

export type AxelarSigningClientMessage =
  | AxelarEncodeObject
  | CosmosEncodeObject;

export class AxelarSigningStargateClient extends SigningStargateClient {
  public messages: AxelarMsgClient;

  protected constructor(
    tmClient: Tendermint37Client | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions
  ) {
    const { registry, aminoTypes } = getSigningAxelarClientOptions();

    super(tmClient, signer, {
      registry,
      aminoTypes,
      gasPrice: STANDARD_GAS_PRICE,
      ...options,
    });

    this.messages = createMsgClient(this);
  }

  static override async connect(
    endpoint: string | HttpEndpoint,
    options: StargateClientOptions = {}
  ) {
    const tmClient = await Tendermint37Client.connect(endpoint);
    return new this(tmClient, {} as OfflineSigner, options) as StargateClient;
  }

  static override async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {}
  ) {
    const tmClient = await Tendermint37Client.connect(endpoint);
    return new this(tmClient, signer, options);
  }

  static override offline(
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {}
  ) {
    return Promise.resolve(new this(undefined, signer, options));
  }

  override simulate(
    signerAddress: string,
    messages: readonly AxelarSigningClientMessage[],
    memo: string | undefined
  ) {
    return super.simulate(signerAddress, messages, memo);
  }

  override sign(
    signerAddress: string,
    messages: readonly AxelarSigningClientMessage[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData
  ): Promise<TxRaw> {
    return super.sign(signerAddress, messages, fee, memo, explicitSignerData);
  }

  override signAndBroadcast(
    signerAddress: string,
    messages: readonly AxelarSigningClientMessage[],
    fee: number | StdFee | "auto",
    memo?: string
  ) {
    return super.signAndBroadcast(signerAddress, messages, fee, memo);
  }
}
