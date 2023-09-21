import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

import { STANDARD_FEE } from "./constants";
import { createAxelarRPCClient } from "./rpc-client";
import { RpcImpl } from "./rpc-client/rpcImpl";

describe("rpc client", () => {
  test("broadcast link transaction", async () => {
    const axelarRpcUrl = "https://axelartest-rpc.quickapi.com";
    const axelarLcdUrl = "https://axelartest-lcd.quickapi.com";
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );

    let response;

    const cb = (data: DeliverTxResponse) => (response = data);

    const rpcClient = await createAxelarRPCClient({
      environment: "testnet",
      axelarRpcUrl,
      rpcImpl: new RpcImpl(
        axelarRpcUrl,
        axelarLcdUrl,
        wallet,
        "axelar-testnet-lisbon-3",
        cb,
        {
          fee: STANDARD_FEE,
          broadcastPollIntervalMs: 300,
          broadcastTimeoutMs: 60_000,
        }
      ),
    });

    await rpcClient.broadcast.evm.Link({
      sender: toAccAddress((await wallet.getAccounts())[0]?.address as string),
      recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      recipientChain: "avalanche",
      asset: "wavax-wei",
      chain: "fantom",
    });

    expect(response).toBeTruthy();
  });
});
