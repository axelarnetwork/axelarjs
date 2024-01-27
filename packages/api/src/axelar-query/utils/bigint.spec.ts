import { gasToWei } from "./bigint";

describe("bigint", () => {
  test("should work even gas_price has more fractional digits than specified decimals", () => {
    const wei = gasToWei(1000000n, "0.00000001", 6);
    expect(wei).toBe(10000n);
  });
});
