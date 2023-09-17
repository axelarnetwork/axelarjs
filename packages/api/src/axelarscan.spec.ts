import { AxelarscanClient, createAxelarscanNodeClient } from "./axelarscan";

describe("axelarscan", () => {
  describe("searchTransactions", () => {
    let api: AxelarscanClient;

    beforeEach(() => {
      api = createAxelarscanNodeClient({
        prefixUrl: "https://testnet.api.axelarscan.io",
      });
    });

    test("It should get link transactions", async () => {
      const res = await api.getRecentLinkTransactions({ size: 10 });
      expect(res?.length === 10);
    });
  });
});
