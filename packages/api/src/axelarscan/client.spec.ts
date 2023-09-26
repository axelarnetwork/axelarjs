import { createAxelarscanClient } from "./client";

describe("axelarscan", () => {
  describe("searchTransactions", () => {
    test("It should get link transactions", async () => {
      const api = createAxelarscanClient("testnet");
      const res = await api.getRecentLinkTransactions({ size: 10 });

      expect(res?.length === 10);
    });
  });
});
