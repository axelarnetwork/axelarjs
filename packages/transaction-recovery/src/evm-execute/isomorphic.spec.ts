import { createGMPClient, type SearchGMPResponseData } from "@axelarjs/api/gmp";
import { ENVIRONMENTS } from "@axelarjs/core";

import { randomBytes } from "crypto";
import { type Hex } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { describe, expect, test, vi } from "vitest";

import { evmExecute } from "./client";

// Mock setup
const mocks = vi.hoisted(() => {
  return {
    executeWithToken: vi.fn(),
    execute: vi.fn(),
  };
});

vi.mock("viem", async () => {
  const actualViem = await vi.importActual("viem");
  return {
    ...actualViem,
    getContract: vi.fn().mockReturnValue({ write: mocks }),
  };
});

vi.mock("@axelarjs/api/gmp", async () => {
  const actualGMP = await vi.importActual("@axelarjs/api/gmp");
  return {
    ...actualGMP,
    createGMPClient: vi.fn().mockReturnValue({
      searchGMP: vi.fn(),
    }),
  };
});

// Helper functions
type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

function mockGMPData(data?: RecursivePartial<SearchGMPResponseData>) {
  const gmpClient = createGMPClient(ENVIRONMENTS.mainnet);
  gmpClient.searchGMP = vi.fn().mockResolvedValueOnce(data ? [data] : []);
}

function generateRandomHex(bytes: number): Hex {
  return randomBytes(bytes).toString("hex") as Hex;
}

describe("evmExecute", () => {
  test("should return false if it's already executed", async () => {
    mockGMPData({
      executed: { transactionHash: generateRandomHex(32) },
      approved: { transactionHash: generateRandomHex(32) },
    });

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe("Transaction already executed");
  });

  test("should return false if the tx has not approved", async () => {
    mockGMPData({});

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe("Transaction not approved");
  });

  test("should return false if tx hash not found", async () => {
    mockGMPData();

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe("Transaction not found");
  });

  test("should return false if the destination chain is not supported", async () => {
    mockGMPData({
      approved: { transactionHash: generateRandomHex(32) },
      call: { returnValues: { destinationChain: "unsupported" } },
    });

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe("Cannot find rpcUrl for destination chain");
  });

  test("should return true and execute callContract if the tx is valid", async () => {
    const commandId = generateRandomHex(32);
    const sourceChain = "ethereum";
    const contractAddress = generateRandomHex(20);

    mockGMPData({
      approved: { transactionHash: generateRandomHex(32) },
      command_id: commandId,
      call: {
        event: "ContractCall",
        chain: sourceChain,
        address: contractAddress,
        returnValues: {
          destinationChain: "optimism",
          payload: "0x",
          destinationContractAddress: generateRandomHex(20),
        },
      },
    });

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
      executeOptions: { privateKey: generatePrivateKey() },
    });

    expect(response.success).toBe(true);
    expect(response.error).toBeUndefined();
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.execute).toHaveBeenCalledWith(
      [commandId, sourceChain, contractAddress, "0x"],
      expect.anything()
    );
  });

  test("should return true and execute callContractWithToken if the tx is valid", async () => {
    const commandId = generateRandomHex(32);
    const sourceChain = "ethereum";
    const contractAddress = generateRandomHex(20);

    mockGMPData({
      approved: { transactionHash: generateRandomHex(32) },
      command_id: commandId,
      call: {
        event: "ContractCallWithToken",
        chain: sourceChain,
        address: contractAddress,
        returnValues: {
          destinationChain: "optimism",
          payload: "0x",
          amount: "1",
          symbol: "ETH",
          destinationContractAddress: generateRandomHex(20),
        },
      },
    });

    const response = await evmExecute({
      environment: ENVIRONMENTS.mainnet,
      srcTxHash: generateRandomHex(32),
      executeOptions: { privateKey: generatePrivateKey() },
    });

    expect(response.success).toBe(true);
    expect(response.error).toBeUndefined();
    expect(mocks.executeWithToken).toHaveBeenCalledTimes(1);
    expect(mocks.executeWithToken).toHaveBeenCalledWith(
      [commandId, sourceChain, contractAddress, "0x", "ETH", 1n],
      expect.anything()
    );
  });
});
