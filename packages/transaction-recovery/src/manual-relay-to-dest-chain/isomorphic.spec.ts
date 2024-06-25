import { hashMessage } from "viem";

import { manualRelayToDestChain } from "./client";
import { ManualRelayToDestChainError } from "./error";

describe("manualRelayToDestChain", () => {
  const environment = "testnet";
  test("should throw error when the tx is already executed", async () => {
    // optimism -> avalanche
    const txHash =
      "0xfe09df5f567707c2fb0c7faf064ebd1185902d1dd73fcb8be52727d3a9cffd53";
    await expect(
      manualRelayToDestChain({
        txHash,
        environment,
      })
    ).rejects.toThrowError();
  });

  test("should throw error when the tx is non-axelar", async () => {
    const randomTxHash = hashMessage("random tx hash");
    await expect(
      manualRelayToDestChain({
        txHash: randomTxHash,
        environment,
      })
    ).rejects.toThrowError(ManualRelayToDestChainError.TX_NOT_FOUND);
  });

  test("should throw error when the tx is already approved", async () => {
    const txHash =
      "0x3d644feb70ec6a444394d13fc9dc145229d9c1e8453c0682a03810f9352e1664";
    await expect(
      manualRelayToDestChain({
        txHash,
        environment,
      })
    ).rejects.toThrowError();
  });

  test("should return success: false when the tx didn't pay the gas", async () => {
    const txHash =
      "0xe3853baa7f08d923b5e3eef212426f0ef7418cb84feaf6938e1f7617f598f4d1";

    const response = await manualRelayToDestChain({
      txHash,
      environment,
    });

    expect(response.success).toEqual(false);
  });
});
