import { loadAssets } from "..";

const mock = {
  loadAssets: loadAssets,
};

describe("loadAssets()", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    vitest.spyOn(mock, "loadAssets");
  });

  describe("when loadAssets is called with known env, but not mainnet", () => {
    beforeEach(async () => {
      await mock.loadAssets({
        environment: "testnet",
      });
    });

    test("then it should call loadAssets", () => {
      expect(mock.loadAssets).toHaveBeenCalledWith({
        environment: "testnet",
      });
    });

    // test("then it should return assets", () => {
    //   expect(mock.loadAssets).toHaveReturnedWith(Object.values(testnet));
    // });
  });

  describe("when loadAssets is called with mainnet", () => {
    beforeEach(async () => {
      await mock.loadAssets({
        environment: "mainnet",
      });
    });

    test("then it should call loadAssets", () => {
      expect(mock.loadAssets).toHaveBeenCalledWith({
        environment: "mainnet",
      });
    });

    // test("then it should return assets", () => {
    //   expect(mock.loadAssets).toHaveReturnedWith(Object.values(mainnet));
    // });
  });
});
