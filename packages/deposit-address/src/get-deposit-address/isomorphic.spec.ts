import { AXELAR_RPC_URLS_FALLBACK, ENVIRONMENTS } from "@axelarjs/core";

import * as mod from "../get-deposit-address/helpers/depositService";
import {
  getDepositAddress,
  getLinkedDepositAddress,
  getNativeUnwrapDepositAddress,
  getNativeWrapDepositAddress,
} from "./client";
import type {
  DepositAddressOptions,
  DepositNativeUnwrapOptions,
  DepositNativeWrapOptions,
  SendOptions,
} from "./types";

describe("Deposit Address", () => {
  describe("getDepositAddress", () => {
    test("should get the deposit address if the asset is 'native'", async () => {
      const params: DepositAddressOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Fantom",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        asset: "native",
        environment: ENVIRONMENTS.testnet,
      };

      const depositAddress = await getDepositAddress(params);

      expect(depositAddress).toBeDefined();
    });

    test("should get the deposit address if the asset is defined, but wrappable at the destination chain", async () => {
      const params: DepositAddressOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Fantom",
        asset: "wftm-wei",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      const depositAddress = await getDepositAddress(params);

      expect(depositAddress).toBeDefined();
    });

    test("should get the deposit address if the asset is defined and not unwrappable at the destination chain", async () => {
      const params: DepositAddressOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Fantom",
        asset: "wavax-wei",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      const depositAddress = await getDepositAddress(params);

      expect(depositAddress).toBeDefined();
    });
  });

  describe("getLinkedDepositAddress", () => {
    test.skip("should get linked deposit address from an EVM source chain", async () => {
      const params: SendOptions = {
        sourceChain: "Fantom",
        destinationChain: "ethereum-sepolia",
        asset: "uaxl",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };
      const res = await getLinkedDepositAddress(params);

      expect(res?.depositAddress).toBeTruthy();
      expect(res?.sourceChain?.toLowerCase()).toEqual(
        params.sourceChain.toLowerCase()
      );
      expect(res?.depositAddress?.startsWith("0x")).toBeTruthy();
    });

    test("should get linked deposit address from an cosmos-based source chain", async () => {
      const params: SendOptions = {
        sourceChain: "osmosis-7",
        destinationChain: "ethereum-sepolia",
        asset: "uaxl",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };
      const res = await getLinkedDepositAddress(params);

      expect(res?.depositAddress).toBeTruthy();
      expect(res?.sourceChain?.toLowerCase()).toEqual("axelarnet");
      expect(res?.depositAddress?.startsWith("axelar")).toBeTruthy();
    });
  });

  describe("getNativeUnwrapDepositAddress", () => {
    test("should receive an address for unwrap deposit address", async () => {
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

    test("should throw error when passing invalid source chain or dest chain to unwrap deposit address", async () => {
      const invalidSourceParams: DepositNativeUnwrapOptions = {
        sourceChain: "Avax",
        destinationChain: "Fantom",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      await expect(
        getNativeUnwrapDepositAddress(invalidSourceParams)
      ).rejects.toThrowError();

      const invalidDestParams: DepositNativeUnwrapOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Ftm",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      await expect(
        getNativeUnwrapDepositAddress(invalidDestParams)
      ).rejects.toThrowError();
    });
  });

  describe("getNativeWrapDepositAddress", () => {
    test("should receive an address for wrap deposit address", async () => {
      const params: DepositNativeWrapOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Fantom",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      const depositAddress = await getNativeWrapDepositAddress(params);
      expect(depositAddress).toBeDefined();
    });

    test("should get inactive chain error", async () => {
      const params: DepositNativeWrapOptions = {
        sourceChain: "terra",
        destinationChain: "Fantom",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      await expect(getNativeWrapDepositAddress(params)).rejects.toThrowError();
    });

    test("should throw error when passing invalid source chain or dest chain to wrap deposit address", async () => {
      const invalidSourceParams: DepositNativeWrapOptions = {
        sourceChain: "Avax",
        destinationChain: "Fantom",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      await expect(
        getNativeWrapDepositAddress(invalidSourceParams)
      ).rejects.toThrowError();

      const invalidDestParams: DepositNativeWrapOptions = {
        sourceChain: "Avalanche",
        destinationChain: "Ftm",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        refundAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
      };

      await expect(
        getNativeWrapDepositAddress(invalidDestParams)
      ).rejects.toThrowError();
    });
  });
});

describe("requestConfigs", () => {
  test("should allow users to customize an RPC endpoint", async () => {
    vi.spyOn(mod, "getActiveChains");
    const fallbackAxelarRpcUrls = AXELAR_RPC_URLS_FALLBACK.testnet;

    let depositAddress, rpcUrl;
    for (const axelarRpcUrl of fallbackAxelarRpcUrls) {
      const params: SendOptions = {
        sourceChain: "osmosis-7",
        destinationChain: "ethereum-sepolia",
        asset: "uaxl",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        environment: ENVIRONMENTS.testnet,
        requestConfig: { axelarRpcUrl },
      };

      const depositResponse = await getLinkedDepositAddress(params).catch(
        () => undefined
      );

      if (!depositResponse) continue;

      depositAddress = depositResponse?.depositAddress;
      rpcUrl = axelarRpcUrl;
    }

    expect(depositAddress).toBeTruthy();
    expect(mod.getActiveChains).toHaveBeenCalledWith("testnet", {
      axelarRpcUrl: rpcUrl,
    });
  });
});
