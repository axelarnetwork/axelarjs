import { ENVIRONMENTS } from "@axelarjs/core";

import getDepositAddressNode from "./node";
import { SendOptions } from "./types";

describe("getDepositAddress - node", () => {
  test("get deposit address", async () => {
    const params: SendOptions = {
      sourceChain: "Fantom",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      module: "evm",
      environment: ENVIRONMENTS.testnet,
    };
    const res = await getDepositAddressNode(params);
    expect(res?.depositAddress).toBeTruthy();
  });
});
