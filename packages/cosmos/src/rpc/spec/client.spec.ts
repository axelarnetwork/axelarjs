import { AXELAR_LCD_URLS, AXELAR_RPC_URLS_FALLBACK } from "@axelarjs/core";
import type { LinkResponse } from "@axelarjs/proto/axelar/evm/v1beta1/tx";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

import { STANDARD_FEE } from "../../constants";
import { createAxelarRPCTxClient } from "../index";
import { RpcImpl } from "../rpcImpl";
import { MOCK_BROADCAST_RESPONSE } from "./mock";

describe("rpc client", () => {
  const fallbackRpcUrls =
    AXELAR_RPC_URLS_FALLBACK.testnet as unknown as string[];
  const fallbackLcdUrls = AXELAR_LCD_URLS.testnet as unknown as string[];

  test("broadcast link transaction with rpc client implementation", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );

    let response: DeliverTxResponse | undefined;
    let linkResponse: LinkResponse | undefined;

    for (let i = 0; i < fallbackRpcUrls.length; i++) {
      const onDeliverTxResponse = (data: DeliverTxResponse) => {
        response = data;
      };
      const stubRpcImpl = new RpcImpl(
        fallbackRpcUrls[i] as string,
        fallbackLcdUrls[i] as string,
        wallet,
        "axelar-testnet-lisbon-3",
        onDeliverTxResponse
      );
      stubRpcImpl;

      vi.spyOn(stubRpcImpl, "broadcastTx").mockImplementation(() =>
        Promise.resolve(MOCK_BROADCAST_RESPONSE)
      );

      const rpcClient = createAxelarRPCTxClient(
        {
          environment: "testnet",
          axelarRpcUrl: fallbackRpcUrls[i] as string,
          axelarLcdUrl: fallbackLcdUrls[i] as string,
          chainId: "axelar-testnet-lisbon-3",
          rpcImpl: stubRpcImpl,
        },
        wallet,
        {
          fee: STANDARD_FEE,
          broadcastPollIntervalMs: 300,
          broadcastTimeoutMs: 60_000,
        }
      );

      const [accData] = await wallet.getAccounts();

      try {
        linkResponse = await rpcClient.evm.Link({
          sender: toAccAddress(String(accData?.address)),
          recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
          recipientChain: "avalanche",
          asset: "wavax-wei",
          chain: "fantom",
        });
      } catch (e) {
        // no-op
      }
    }

    expect(response).toBeDefined();
    expect(response?.transactionHash).toEqual(
      MOCK_BROADCAST_RESPONSE.transactionHash
    );
    expect(linkResponse?.depositAddr).toBeDefined();
  });
});
