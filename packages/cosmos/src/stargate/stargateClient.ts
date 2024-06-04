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
import { AxelarQueryClient, createQueryClient } from "./queryClient";
import type { ProtobufModule } from "./types";
import {
  convertToCamelCaseDeep,
  convertToSnakeCaseDeep,
  createAminoTypeNameFromProtoTypeUrl,
} from "./utils";

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

export function getAxelarSigningClientOptions(
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
  /**
   * @deprecated Use the {@link tx} field instead.
   */
  public readonly messages: AxelarMsgClient;
  public readonly tx: AxelarMsgClient;
  public readonly query?: AxelarQueryClient | undefined;

  protected constructor(
    tmClient: Tendermint37Client | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions
  ) {
    const { registry, aminoTypes } = getAxelarSigningClientOptions();

    super(tmClient, signer, {
      registry,
      aminoTypes,
      gasPrice: STANDARD_GAS_PRICE,
      ...options,
    });

    this.tx = createMsgClient(this);

    this.messages = this.tx;

    this.query =
      tmClient !== undefined ? createQueryClient(tmClient) : undefined;
  }

  static async connectToFirstAvailable(
    endpoints: (string | HttpEndpoint)[],
    offlineSigner?: OfflineSigner | undefined,
    options: StargateClientOptions = {}
  ) {
    let tmClient: Tendermint37Client | undefined;

    for (const endpoint of endpoints) {
      try {
        tmClient = await Tendermint37Client.connect(endpoint);
        break;
      } catch (error) {
        // no-op
      }
    }

    if (!tmClient) {
      throw new Error("Failed to connect to any of the provided endpoints");
    }

    return new this(tmClient, offlineSigner || ({} as OfflineSigner), options);
  }

  static override async connect(
    endpoint: string | HttpEndpoint,
    options: StargateClientOptions = {}
  ) {
    const tmClient = await Tendermint37Client.connect(endpoint);
    return new this(tmClient, {} as OfflineSigner, options);
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

  protected override getQueryClient() {
    return this.query;
  }

  protected override forceGetQueryClient() {
    if (this.query === undefined) {
      throw new Error(
        "Query client not available. You cannot use online functionality in offline mode."
      );
    }

    return this.query;
  }
}

export async function createAxelarQueryClient(
  endpoint: string | HttpEndpoint,
  options: StargateClientOptions = {}
) {
  const client = await AxelarSigningStargateClient.connect(endpoint, options);

  return client.query as AxelarQueryClient;
}

export async function createAxelarQueryClientWithFallback(
  endpoints: (string | HttpEndpoint)[],
  options: StargateClientOptions = {}
) {
  const client = await AxelarSigningStargateClient.connectToFirstAvailable(
    endpoints,
    undefined,
    options
  );

  return client.query as AxelarQueryClient;
}

export const createAxelarSigningClient =
  AxelarSigningStargateClient.connectWithSigner.bind(
    AxelarSigningStargateClient
  );

export const createAxelarSigningClientWithFallback =
  AxelarSigningStargateClient.connectToFirstAvailable.bind(
    AxelarSigningStargateClient
  );

export const createAxelarBroadcastClient =
  StargateClient.connect.bind(StargateClient);
