import { MsgServiceClientImpl } from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import { LinkRequest } from "@axelarjs/proto/axelar/axelarnet/v1beta1/tx";

import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient, StdFee } from "@cosmjs/stargate";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";
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
      amount: "1000",
    },
  ],
  gas: "5000000",
};
export const getAccountInfo = async (address: string) => {
  try {
    const uri = `https://lcd-axelar-testnet.imperator.co/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await fetch(uri).then((res) => res.json());

    return response.account;
  } catch (e) {
    console.log(e);
  }
};
export const defaultSigningClientOptions = {
  broadcastPollIntervalMs: 300,
  broadcastTimeoutMs: 8_000,
  gasPrice: GasPrice.fromString("0.01ucosm"),
};
class RpcIml implements Rpc {
  protected axelarRpcUrl: string;
  constructor(axelarRpcUrl: string) {
    this.axelarRpcUrl = axelarRpcUrl;
  }

  public async request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<any> {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );
    const sender = (await wallet.getAccounts())[0]?.address as string;
    const account = await getAccountInfo(sender);
    const pubKey = (await wallet.getAccounts())[0]?.pubkey;
    // const txBody = LinkRequest.decode(data);
    // console.log({ txBody, account });
    if (!account || !pubKey) throw new Error("account not found");
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: [
            {
              typeUrl: "/axelar.axelarnet.v1beta1.LinkRequest",
              value: data,
            },
          ],
          memo: "CTT test",
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
      chainId: "axelar-testnet-lisbon-3",
      accountNumber: Long.fromString(account.account_number),
    };

    const signed = await wallet.signDirect(sender, signDoc);

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    };

    const txHash = await broadcastTxSync(wallet, signedTx.tx);
  }
}
export const broadcastTxSync = async (
  wallet: OfflineSigner,
  tx: Uint8Array
): Promise<Uint8Array> => {
  const signer = await SigningStargateClient.connectWithSigner(
    "https://rpc-axelar-testnet.imperator.co:443",
    wallet
  );
  const broadcasted = await signer.broadcastTx(tx);
  console.log({ broadcasted });
  //@ts-ignore
  return broadcasted?.data[0]?.data as Uint8Array;
  // return wallet.sendTx(chainId,  tx, "sync" as BroadcastMode)
};
describe("query client", () => {
  test("do stuff", async () => {
    const axelarRpcUrl = "https://rpc-axelar-testnet.imperator.co:443";
    // const queryApi = await createAxelarQueryClient({
    //   environment: "testnet",
    //   axelarRpcUrl,
    // });

    // const queryApiRes = await queryApi.query.evm.Chains({ status: 1 });

    const broadcastApi = new MsgServiceClientImpl(new RpcIml(axelarRpcUrl));

    // const signingStargateClientAXL = createAxelarSigningClient({
    //   cosmosBasedWalletDetails: {
    //     mnemonic: "",
    //   },
    //   environment: "testnet",
    //   options: {},
    // });

    const broadcastRes = await broadcastApi.Link({
      sender: toAccAddress("axelar1x3z2vepjd7fhe30epncxjrk0lehq7xdq4j6ndq"),
      recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      recipientChain: "avalanche",
      asset: "wavax-wei",
    });
    console.log({ broadcastRes });

    expect(broadcastRes).toBeTruthy();
    // expect(queryApiRes).toBeTruthy();
  });
});
