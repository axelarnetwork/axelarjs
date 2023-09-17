import { DepositAddressClient } from "./deposit-address-api/isomorphic";
import { createDepositAddressApiNodeClient } from "./deposit-address-api/node";

describe("deposit address client", () => {
  describe("get OTC", () => {
    let api: DepositAddressClient = createDepositAddressApiNodeClient({
      prefixUrl: "https://nest-server-testnet.axelar.dev",
    });

    test("It should get an OTC", async () => {
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
});
