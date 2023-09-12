import { createAxelarQueryClient } from "./rpc-client";

describe("query client", () => {
  test("do stuff", async () => {
    const client = await createAxelarQueryClient({
      environment: "testnet",
      axelarRpcUrl: "https://rpc-axelar-testnet.imperator.co:443",
    });

    const res = await client.broadcast.axelarnet.Link({
      sender: new Uint8Array(),
      recipientAddr: "",
      recipientChain: "",
      asset: "",
    });
    console.log({ res });
    expect(res).toBeTruthy();
  });
});
