import { ENVIRONMENTS } from "@axelarjs/core";

import getDepositAddressNode from "./node";
import { SendOptions } from "./types";

describe("getDepositAddress - node", () => {
  test("get deposit address", async () => {
    const params: SendOptions = {
      sourceChain: "Fantom",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xA57ADCE1d2fE72949E4308867D894CD7E7DE0ef2",
      environment: ENVIRONMENTS.testnet,
    };
    const res = await getDepositAddressNode(params);
    expect(res?.depositAddress).toBeTruthy();
  });
});
