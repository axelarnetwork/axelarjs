import { ENVIRONMENTS } from "@axelarjs/core";

import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

import {
  getDepositAddress,
  getNativeUnwrapDepositAddress,
  getNativeWrapDepositAddress,
} from "./client";
import type {
  DepositNativeUnwrapOptions,
  DepositNativeWrapOptions,
  SendOptions,
} from "./types";

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

  test.only("should receive an address for wrap deposit address", async () => {
    const salt = keccak256(
      encodeAbiParameters(parseAbiParameters("uint"), [
        BigInt(new Date().getTime()),
      ])
    );
    const params: DepositNativeWrapOptions = {
      sourceChain: "Avalanche",
      destinationChain: "Fantom",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      salt,
      environment: ENVIRONMENTS.testnet,
    };

    const depositAddress = await getNativeWrapDepositAddress(params);
    expect(depositAddress).toBeDefined();
  });

  test.only("should receive an address for unwrap deposit address", async () => {
    const params: DepositNativeUnwrapOptions = {
      sourceChain: "Fantom",
      destinationChain: "Avalanche",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      environment: ENVIRONMENTS.testnet,
    };

    const depositAddress = await getNativeUnwrapDepositAddress(params);
    expect(depositAddress).toBeDefined();
  });
});
