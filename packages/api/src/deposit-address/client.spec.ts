import { ENVIRONMENTS } from "@axelarjs/core";

import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { type OTC } from "../deposit-address";
import { createDepositAddressApiClient } from "./client";

describe("deposit address client (node)", () => {
  describe("get OTC", () => {
    test("It should get an OTC", async () => {
      const api = createDepositAddressApiClient(ENVIRONMENTS.testnet);
      const otcRes = await api.getOTC({
        signerAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      });
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
      const otcRes: OTC = await api.getOTC({
        signerAddress: dummyAccount.address,
      });
      const fromChain = "osmosis-7";
      const toChain = "ethereum-2";
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
      const otcRes: OTC = await api.getOTC({
        signerAddress: dummyAccount.address,
      });
      const fromChain = "Fantom";
      const toChain = "ethereum-2";
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
