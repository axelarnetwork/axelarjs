import { MsgServiceClientImpl } from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";

import grpc, { Client } from "@grpc/grpc-js";
import { Rpc } from "cosmjs-types/helpers";

import { createAxelarQueryClient } from "./rpc-client";

class RpcIml implements Rpc {
  protected axelarRpcUrl: string;
  constructor(axelarRpcUrl: string) {
    this.axelarRpcUrl = axelarRpcUrl;
  }

  public async request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array> {
    const rpcClient = new Client(
      this.axelarRpcUrl,
      grpc.credentials.createInsecure()
    );

    const deadline = Date.now() + 100;
    await rpcClient.waitForReady(deadline, () => {});

    const call = rpcClient.makeUnaryRequest(
      `${service}/${method}`,
      (arg) => arg,
      (arg) => arg,
      Buffer.from(data),
      () => {}
    );

    call.on("data", (data) => {
      console.log({ data });
    });

    call.on("end", (e) => console.log("ended"));
  }
}
describe("query client", () => {
  test("do stuff", async () => {
    const axelarRpcUrl = "https://rpc-axelar-testnet.imperator.co:443";
    const queryApi = await createAxelarQueryClient({
      environment: "testnet",
      axelarRpcUrl,
    });

    const queryApiRes = await queryApi.query.evm.Chains({ status: 1 });

    const broadcastApi = new MsgServiceClientImpl(new RpcIml(axelarRpcUrl));

    const broadcastRes = await broadcastApi.Link({
      sender: new Uint8Array(),
      recipientAddr: "",
      recipientChain: "",
      asset: "",
    });

    expect(broadcastRes).toBeTruthy();
    expect(queryApiRes).toBeTruthy();
  });
});
