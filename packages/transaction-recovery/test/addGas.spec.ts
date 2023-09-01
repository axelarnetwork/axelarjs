import addGas from "~/addGas";

describe("addGas", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe("add gas to a cosmos transaction", () => {
    console.log("running addGas test");
    test("It should be able to add gas to a cosmos transaction", async () => {
      const response = addGas();
      expect(response).toBeTruthy();
    });
  });
});
