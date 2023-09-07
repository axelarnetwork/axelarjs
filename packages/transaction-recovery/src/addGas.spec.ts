import { createAxelarSigningClient } from "@axelarjs/cosmos/signing-client";

import addGas from "./addGas";

const TX_HASH = `A6516262B303AF6D5D1599F46B52D2ED47DC1C1FFA3E56822A4313916C9AC8C4`;

describe("addGas", () => {
  test("do stuff", async () => {
    const signingClient = await createAxelarSigningClient({
      environment: "testnet",
      axelarRpcUrl: "https://axelartest-rpc.quickapi.com",
      cosmosBasedWalletDetails: {
        mnemonic: process.env["COSMOS_WALLET_MNEMONIC"] || "",
      },
      options: {},
    });

    await addGas(signingClient, TX_HASH);
  });
});
