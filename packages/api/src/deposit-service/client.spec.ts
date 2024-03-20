import { ENVIRONMENTS } from "@axelarjs/core";

import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

import { createDepositServiceApiClient } from "./client";

describe("deposit service", () => {
  test("wrap deposit address should return the address when passing params correctly", async () => {
    const client = createDepositServiceApiClient(ENVIRONMENTS.testnet);
    const salt = keccak256(
      encodeAbiParameters(parseAbiParameters("uint"), [
        BigInt(new Date().getTime()),
      ]),
    );

    const response = await client.getDepositAddressForNativeWrap({
      refundAddress: "0xdeadbeef29292929192939494959594933929292",
      destinationAddress: "0xdeadbeef29292929192939494959594933929292",
      fromChain: "Avalanche",
      toChain: "Fantom",
      salt,
    });

    expect(response).toBeDefined();
  });

  test("get unwrap deposit address", async () => {
    const client = createDepositServiceApiClient(ENVIRONMENTS.testnet);

    const response = await client.getDepositAddressForNativeUnwrap({
      refundAddress: "0xdeadbeef29292929192939494959594933929292",
      destinationAddress: "0xdeadbeef29292929192939494959594933929292",
      fromChain: "Avalanche",
      toChain: "Fantom",
    });

    expect(response).toBeDefined();
  });
});
