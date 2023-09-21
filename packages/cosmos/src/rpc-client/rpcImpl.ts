import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
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

import { STANDARD_FEE } from "~/constants";
import { BroadcastTxOptions } from "../types";

export class RpcImpl implements Rpc {
  protected axelarRpcUrl: string;
  protected axelarLcdUrl: string;
  protected offlineSigner: DirectSecp256k1HdWallet;
  protected signer?: StargateClient;
  protected chainId: string;
  protected broadcastOptions?: BroadcastTxOptions;
  protected onDeliverTxResponse?:
    | undefined
    | ((deliverTxResponse: DeliverTxResponse) => void);

  constructor(
    axelarRpcUrl: string,
    axelarLcdUrl: string,
    offlineSigner: DirectSecp256k1HdWallet,
    chainId: string,
    onDeliverTxResponse?:
      | undefined
      | ((deliverTxResponse: DeliverTxResponse) => void),
    broadcastOptions?: BroadcastTxOptions
  ) {
    this.axelarRpcUrl = axelarRpcUrl;
    this.axelarLcdUrl = axelarLcdUrl;
    this.offlineSigner = offlineSigner;
    this.chainId = chainId;
    this.broadcastOptions = broadcastOptions;
    this.onDeliverTxResponse = onDeliverTxResponse;
  }

  public async request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array> {
    const sender = (await this.offlineSigner.getAccounts())[0]
      ?.address as string;

    const account = await this.getAccountInfo(sender);

    const [accData] = await this.offlineSigner.getAccounts();

    if (!account || !accData?.pubkey) {
      throw new Error("account not found");
    }

    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: [
            {
              typeUrl: this.translateTypeUrlHack(service, method),
              value: data,
            },
          ],
          memo: `@axelarjs/cosmos tx signed at: ${new Date().toLocaleTimeString()}`,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: accData.pubkey,
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
          amount: (this.broadcastOptions?.fee ?? STANDARD_FEE).amount.map(
            (coin) => {
              return {
                denom: coin.denom,
                amount: coin.amount.toString(),
              };
            }
          ),
          gasLimit: (this.broadcastOptions?.fee ?? STANDARD_FEE).gas,
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

    const deliverTxResponse = await this.broadcastTx(signedTx.tx);

    this.onDeliverTxResponse && this.onDeliverTxResponse(deliverTxResponse);

    return new Uint8Array();
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

  public async broadcastTx(tx: Uint8Array): Promise<DeliverTxResponse> {
    const signer = await this.getSigner();

    return signer.broadcastTx(
      tx,
      this.broadcastOptions?.broadcastTimeoutMs,
      this.broadcastOptions?.broadcastPollIntervalMs
    );
  }

  private translateTypeUrlHack(service: string, method: string) {
    return `/${service.replace(".MsgService", "")}.${method}Request`;
  }

  private async getAccountInfo(address: string): Promise<
    | {
        address: string;
        account_number: string;
        sequence: number;
      }
    | undefined
  > {
    try {
      const { account } = await fetch(
        `${this.axelarLcdUrl}/cosmos/auth/v1beta1/accounts/${address}`
      ).then((res) => res.json());

      return account;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
