import { ENVIRONMENTS } from "@axelarjs/core";

import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { type DepositAddressClient, type OTC } from "../deposit-address";
import { createDepositAddressApiClient } from "./client";

const retryGetOtc = async (
  api: DepositAddressClient,
  signerAddress: `0x${string}`
) => {
  let otcRes!: OTC;
  let retry = 0;
  while (retry < 10) {
    try {
      otcRes = await api.getOTC({
        signerAddress: signerAddress,
      });
      break;
    } catch (error) {
      if (error instanceof Error) {
        if (error.toString().includes("429: Too Many Requests")) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          retry++;
        } else {
          throw error;
        }
      }
    }
  }
  return otcRes;
};

describe("deposit address client (node)", () => {
  describe("get OTC", () => {
    test("It should get an OTC", async () => {
      const api = createDepositAddressApiClient(ENVIRONMENTS.testnet);
      const otcRes = await retryGetOtc(
        api,
        "0xB8Cd93C83A974649D76B1c19f311f639e62272BC"
      );

      expect(
        otcRes.validationMsg?.includes(
          "Verify I'm a real user with this one-time-code"
        )
      ).toBeTruthy();
    });
  });

  describe("get deposit address", () => {
    test("It should get a deposit address after generating a unique OTC (cosmos)", async () => {
      const api = createDepositAddressApiClient(ENVIRONMENTS.testnet);
      const dummyAccount = privateKeyToAccount(generatePrivateKey());
      const otcRes: OTC = await retryGetOtc(api, dummyAccount.address);
      const fromChain = "ojo";
      const toChain = "ethereum-sepolia";
      const asset = "uaxl";

      const signature = await dummyAccount.signMessage({
        message: otcRes.validationMsg,
      });

      const depositAddressResponse = await api.requestDepositAddress({
        fromChain,
        toChain,
        destinationAddress: dummyAccount.address,
        publicAddress: dummyAccount.address,
        asset,
        signature,
      });

      const expectedResponse = JSON.stringify({
        assetCommonKey: asset,
        destinationAddress: dummyAccount.address,
        destinationChainIdentifier: toChain,
        sourceModule: "axelarnet",
        type: "link",
      });

      expect(depositAddressResponse.data.roomId).toEqual(expectedResponse);
    });

    test("It should get a deposit address after generating a unique OTC (evm)", async () => {
      const api = createDepositAddressApiClient(ENVIRONMENTS.testnet);
      const dummyAccount = privateKeyToAccount(generatePrivateKey());

      // retry if get http error 429 (too many requests)
      const otcRes = await retryGetOtc(api, dummyAccount.address);
      const fromChain = "Fantom";
      const toChain = "ethereum-sepolia";
      const asset = "uaxl";

      const signature = await dummyAccount.signMessage({
        message: otcRes.validationMsg,
      });

      const depositAddressResponse = await api.requestDepositAddress({
        fromChain,
        toChain,
        destinationAddress: dummyAccount.address,
        publicAddress: dummyAccount.address,
        asset,
        signature,
      });

      const expectedResponse = JSON.stringify({
        assetCommonKey: asset,
        destinationAddress: dummyAccount.address,
        destinationChainIdentifier: toChain,
        sourceModule: "evm",
        type: "link",
      });

      expect(depositAddressResponse.data.roomId).toEqual(expectedResponse);
    });
  });
});
