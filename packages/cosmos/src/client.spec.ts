import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

import { createAxelarRPCClient } from "./rpc-client";
import { RpcIml } from "./rpc-client/rpcImpl";

describe("query client", () => {
  test("do stuff", async () => {
    const axelarRpcUrl = "https://axelartest-rpc.quickapi.com";
    const axelarLcdUrl = "https://axelartest-lcd.quickapi.com";
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );

    const rpcClient = await createAxelarRPCClient({
      environment: "testnet",
      axelarRpcUrl,
      rpcImpl: new RpcIml(
        axelarRpcUrl,
        axelarLcdUrl,
        wallet,
        "axelar-testnet-lisbon-3"
      ),
    });

    const broadcastRes = await rpcClient.broadcast.axelarnet.Link({
      sender: toAccAddress((await wallet.getAccounts())[0]?.address as string),
      recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      recipientChain: "avalanche",
      asset: "wavax-wei",
    });
    console.log({ broadcastRes });

    expect(broadcastRes).toBeTruthy();
    // expect(queryApiRes).toBeTruthy();
  });
});
