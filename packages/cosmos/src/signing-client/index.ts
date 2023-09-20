import {
  Registry,
  DirectSecp256k1HdWallet as Wallet,
  type EncodeObject,
  type OfflineSigner,
} from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  type DeliverTxResponse,
  type SignerData,
  type SigningStargateClientOptions,
  type StdFee,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { getConfigs, type EnvironmentConfigs } from "../constants";
import type { AxelarSigningClientConfig } from "../types";
import { registerAxelarnetTxTypes } from "./axelarnet-tx-types";
import { registerEvmTxTypes } from "./evmish-tx-types";

export * from "./constants";

let instance: AxelarSigningClient;

interface IAxelarSigningClient extends SigningStargateClient {
  signThenBroadcast(
    messages: readonly EncodeObject[],
    fee: number | StdFee | "auto",
    memo?: string
  ): Promise<DeliverTxResponse>;
  signAndGetTxBytes(
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData
  ): Promise<Uint8Array>;
}

export class AxelarSigningClient
  extends SigningStargateClient
  implements IAxelarSigningClient
{
  readonly axelarRpcUrl: string = "";
  readonly signerAddress: string = "";
  protected signerClient?: SigningStargateClient;

  public constructor(
    tendermintClient: Tendermint34Client,
    signer: OfflineSigner,
    signerAddress: string,
    options: SigningStargateClientOptions
  ) {
    super(tendermintClient, signer, options);
    this.signerAddress = signerAddress;
  }

  static async init(config: AxelarSigningClientConfig) {
    if (!instance) {
      const {
        axelarRpcUrl,
        environment,
        options,
        cosmosBasedWalletDetails: walletDetails,
      } = config;

      const links: EnvironmentConfigs = getConfigs(environment);
      const rpc: string = axelarRpcUrl || links.axelarRpcUrl;
      const tmClient = await Tendermint34Client.connect(rpc);
      const prefix = "axelar";

      let wallet: OfflineSigner | undefined;

      if (walletDetails.mnemonic)
        wallet = await Wallet.fromMnemonic(walletDetails.mnemonic, { prefix });
      else if (walletDetails.offlineSigner)
        wallet = walletDetails.offlineSigner;
      else
        throw "you need to pass in either a wallet mnemonic string or offline signer";

      const [account] = await wallet.getAccounts();

      const registry = options.registry || new Registry();
      registerAxelarnetTxTypes(registry);
      registerEvmTxTypes(registry);

      const newOpts = { ...options, registry };

      if (account) {
        return new AxelarSigningClient(
          tmClient,
          wallet,
          account.address,
          newOpts
        );
      }
      throw new Error("no account found in wallet");
    }
    return instance;
  }

  public signThenBroadcast(
    messages: readonly EncodeObject[],
    fee: number | StdFee | "auto",
    memo?: string
  ): Promise<DeliverTxResponse> {
    return super.signAndBroadcast(this.signerAddress, messages, fee, memo);
  }

  public async signAndGetTxBytes(
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData
  ): Promise<Uint8Array> {
    const txRaw = await super.sign(
      this.signerAddress,
      messages,
      fee,
      memo,
      explicitSignerData
    );
    return TxRaw.encode(txRaw).finish();
  }
}

export const createAxelarSigningClient = AxelarSigningClient.init;
