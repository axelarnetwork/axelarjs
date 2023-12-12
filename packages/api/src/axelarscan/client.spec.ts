import { createAxelarscanClient } from "./client";

describe("axelarscan", () => {
  describe("searchTransactions", () => {
    it("Should get link transactions", async () => {
      const api = createAxelarscanClient("testnet");
      const res = await api.getRecentLinkTransactions({ size: 10 });

      expect(res?.length === 10);
    });
  });
  describe("getChainConfigs", () => {
    it("Should get chain configs", async () => {
      const api = createAxelarscanClient("testnet");
      const res = await api.getChainConfigs();

      expect(res?.cosmos.length > 0);
      expect(res?.evm.length > 0);
    });
  });
});
