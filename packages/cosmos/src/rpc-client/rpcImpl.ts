import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  StargateClient,
  StdFee,
} from "@cosmjs/stargate";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Rpc } from "cosmjs-types/helpers";
import Long from "long";

export const STANDARD_FEE: StdFee = {
  amount: [
    {
      denom: "uaxl",
      amount: "1000000",
    },
  ],
  gas: "5000000",
};

export class RpcIml implements Rpc {
  protected axelarRpcUrl: string;
  protected axelarLcdUrl: string;
  protected offlineSigner: DirectSecp256k1HdWallet;
  protected signer?: StargateClient;
  protected chainId: string;
  constructor(
    axelarRpcUrl: string,
    axelarLcdUrl: string,
    offlineSigner: DirectSecp256k1HdWallet,
    chainId: string
  ) {
    this.axelarRpcUrl = axelarRpcUrl;
    this.axelarLcdUrl = axelarLcdUrl;
    this.offlineSigner = offlineSigner;
    this.chainId = chainId;
  }

  private translateTypeUrlHack(service: string, method: string) {
    return `/${service.replace("MsgService", "")}${method}Request`;
  }

  private async getAccountInfo(address: string) {
    try {
      return (
        await fetch(
          `${this.axelarLcdUrl}/cosmos/auth/v1beta1/accounts/${address}`
        ).then((res) => res.json())
      ).account;
    } catch (e) {
      console.log(e);
    }
  }

  public async request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<any> {
    const sender = (await this.offlineSigner.getAccounts())[0]
      ?.address as string;
    const account = await this.getAccountInfo(sender);
    const pubKey = (await this.offlineSigner.getAccounts())[0]?.pubkey;

    if (!account || !pubKey) throw new Error("account not found");
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: [
            {
              typeUrl: this.translateTypeUrlHack(service, method),
              value: data,
            },
          ],
          memo: `CTT test ${new Date().toLocaleTimeString()}`,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
            },
            sequence: Long.fromNumber(account.sequence),
          },
        ],
        fee: Fee.fromPartial({
          amount: STANDARD_FEE.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: STANDARD_FEE.gas,
        }),
      }).finish(),
      chainId: this.chainId,
      accountNumber: Long.fromString(account.account_number),
    };

    const signed = await this.offlineSigner.signDirect(sender, signDoc);

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    };

    const txHash = await this.broadcastTxSync(signedTx.tx);
  }

  private async getSigner() {
    if (!this.signer) {
      this.signer = await SigningStargateClient.connectWithSigner(
        this.axelarRpcUrl,
        this.offlineSigner
      );
    }
    return this.signer;
  }

  private async broadcastTxSync(tx: Uint8Array): Promise<Uint8Array> {
    const defaultSigningClientOptions = {
      broadcastPollIntervalMs: 300,
      broadcastTimeoutMs: 60_000,
    };
    const broadcasted = await (
      await this.getSigner()
    ).broadcastTx(
      tx,
      defaultSigningClientOptions.broadcastTimeoutMs,
      defaultSigningClientOptions.broadcastPollIntervalMs
    );
    console.log({ broadcasted });
    //@ts-ignore
    return broadcasted?.data[0]?.data as Uint8Array;
  }
}
