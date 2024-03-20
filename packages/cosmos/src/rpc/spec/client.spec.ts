import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

import { STANDARD_FEE } from "../../constants";
import { createAxelarRPCTxClient } from "../index";
import { RpcImpl } from "../rpcImpl";
import { MOCK_BROADCAST_RESPONSE } from "./mock";

describe("rpc client", () => {
  test("broadcast link transaction with rpc client implementation", async () => {
    const axelarRpcUrl = "https://rpc-axelar-testnet.imperator.co:443";
    const axelarLcdUrl = "https://lcd-axelar-testnet.imperator.co";
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" },
    );

    let response: DeliverTxResponse | undefined;

    const onDeliverTxResponse = (data: DeliverTxResponse) => {
      response = data;
    };
    const stubRpcImpl = new RpcImpl(
      axelarRpcUrl,
      axelarLcdUrl,
      wallet,
      "axelar-testnet-lisbon-3",
      onDeliverTxResponse,
    );
    stubRpcImpl;

    vi.spyOn(stubRpcImpl, "broadcastTx").mockImplementation(() =>
      Promise.resolve(MOCK_BROADCAST_RESPONSE),
    );

    const rpcClient = createAxelarRPCTxClient(
      {
        environment: "testnet",
        axelarRpcUrl,
        axelarLcdUrl,
        chainId: "axelar-testnet-lisbon-3",
        rpcImpl: stubRpcImpl,
      },
      wallet,
      {
        fee: STANDARD_FEE,
        broadcastPollIntervalMs: 300,
        broadcastTimeoutMs: 60_000,
      },
    );

    const [accData] = await wallet.getAccounts();

    const data = await rpcClient.evm.Link({
      sender: toAccAddress(String(accData?.address)),
      recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      recipientChain: "avalanche",
      asset: "wavax-wei",
      chain: "fantom",
    });

    expect(response).toBeDefined();
    expect(response?.transactionHash).toEqual(
      MOCK_BROADCAST_RESPONSE.transactionHash,
    );
    expect(data.depositAddr).toBeDefined();
  });
});
