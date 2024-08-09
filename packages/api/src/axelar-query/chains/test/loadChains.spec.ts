import { loadChains } from "..";

const mock = {
  loadChains: loadChains,
};

describe("loadChains()", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    vitest.spyOn(mock, "loadChains");
  });

  describe("when loadChains is called with known env, but not mainnet", () => {
    beforeEach(async () => {
      await mock.loadChains({
        environment: "testnet",
      });
    });

    test("then it should call loadChains", () => {
      expect(mock.loadChains).toHaveBeenCalledWith({ environment: "testnet" });
    });

    test("then it should return assets", () => {
      expect(mock.loadChains).toHaveReturned();
    });
  });

  describe("when loadChains is called with mainnet", () => {
    beforeEach(async () => {
      await mock.loadChains({
        environment: "mainnet",
      });
    });

    test("then it should call loadChains", () => {
      expect(mock.loadChains).toHaveBeenCalledWith({ environment: "mainnet" });
    });

    test("then it should return assets", () => {
      expect(mock.loadChains).toHaveReturned();
    });
  });
});
