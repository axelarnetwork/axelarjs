import { ENVIRONMENTS } from "@axelarjs/core";

import getDepositAddress from "./client";
import type { SendOptions } from "./types";

describe("getDepositAddress - node", () => {
  test("get deposit address from an EVM source chain", async () => {
    const params: SendOptions = {
      sourceChain: "Fantom",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      environment: ENVIRONMENTS.testnet,
    };
    const res = await getDepositAddress(params);

    expect(res?.depositAddress).toBeTruthy();
    expect(res?.sourceChain?.toLowerCase()).toEqual(
      params.sourceChain.toLowerCase()
    );
    expect(res?.depositAddress?.startsWith("0x")).toBeTruthy();
  });
  test("get deposit address from an cosmos-based source chain", async () => {
    const params: SendOptions = {
      sourceChain: "osmosis-7",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      environment: ENVIRONMENTS.testnet,
    };
    const res = await getDepositAddress(params);

    expect(res?.depositAddress).toBeTruthy();
    expect(res?.sourceChain?.toLowerCase()).toEqual("axelarnet");
    expect(res?.depositAddress?.startsWith("axelar")).toBeTruthy();
  });
});
