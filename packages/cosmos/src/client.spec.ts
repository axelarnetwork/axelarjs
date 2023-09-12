import { MsgServiceClientImpl } from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";

import { DirectSecp256k1HdWallet, EncodeObject } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient, StdFee } from "@cosmjs/stargate";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";
import { HttpClient, Tendermint37Client } from "@cosmjs/tendermint-rpc";
import grpc, { Client } from "@grpc/grpc-js";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Rpc } from "cosmjs-types/helpers";

import { createAxelarQueryClient } from "./rpc-client";
import { createAxelarSigningClient } from "./signing-client";

export const STANDARD_FEE: StdFee = {
  amount: [
    {
      denom: "uaxl",
      amount: "1000",
    },
  ],
  gas: "5000000",
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
    const client = await SigningStargateClient.connectWithSigner(
      this.axelarRpcUrl,
      wallet,
      defaultSigningClientOptions
    );
    const payload: EncodeObject[] = [
      {
        typeUrl: `axelar.axelarnet.v1beta1.LinkRequest`,
        value: data,
      },
    ];

    const signerAddress = await wallet
      .getAccounts()
      .then((acc) => acc[0]?.address);

    const signAndGetTxBytes = async (
      signerAddress: string,
      messages: EncodeObject[],
      fee: StdFee,
      memo: string
    ) => {
      const txRaw = await client.sign(signerAddress, messages, fee, memo);
      return TxRaw.encode(txRaw).finish();
    };

    return signAndGetTxBytes(
      signerAddress as string,
      payload,
      STANDARD_FEE,
      "hello CTT"
    );
  }
}

// class RpcIml implements Rpc {
//   protected axelarRpcUrl: string;
//   constructor(axelarRpcUrl: string) {
//     this.axelarRpcUrl = axelarRpcUrl;
//   }

//   public async request(
//     service: string,
//     method: string,
//     data: Uint8Array
//   ): Promise<Uint8Array> {
//     const rpcClient = new Client(
//       this.axelarRpcUrl,
//       grpc.credentials.createInsecure()
//     );

//     const deadline = Date.now() + 100;
//     await rpcClient.waitForReady(deadline, () => {});

//     const call = rpcClient.makeUnaryRequest(
//       `${service}/${method}`,
//       (arg) => arg,
//       (arg) => arg,
//       Buffer.from(data),
//       () => {}
//     );

//     call.on("data", (data) => {
//       console.log({ data });
//     });

//     call.on("end", (e) => console.log("ended"));
//   }
// }

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
      asset: "uaxl",
    });

    expect(broadcastRes).toBeTruthy();
    // expect(queryApiRes).toBeTruthy();
  });
});
