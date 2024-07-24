import { gasToWei, multiplyFloatByBigInt } from "./bigint";

describe("bigint", () => {
  test("should work even gas_price has more fractional digits than specified decimals", () => {
    const wei = gasToWei(1000000n, "0.00000001", 6);
    expect(wei).toBe(10000n);
  });

  it("should handle multiplication with whole numbers without loss of precision", () => {
    const floatNum = 2.0;
    const bigIntNum = 12345678901234567890n;

    const result = multiplyFloatByBigInt(floatNum, bigIntNum);
    expect(result).toEqual(24691357802469135780n);
  });

  it("should handle multiplication with decimals without loss of precision", () => {
    const floatNum = 3.14159;
    const bigIntNum = 12345678901234567890n;

    const result = multiplyFloatByBigInt(floatNum, bigIntNum);
    expect(result).toEqual(38785061379329506137n);
  });

  it("should handle very large floating-point numbers", () => {
    const floatNum = 1.2345678901234567; // Large float
    const bigIntNum = 1000n;

    const result = multiplyFloatByBigInt(floatNum, bigIntNum);
    expect(result).toEqual(1234n);
  });

  it("should handle floating points result", () => {
    const floatNum = 1.16;
    const bigIntNum = 169973114000000n;

    const result = multiplyFloatByBigInt(floatNum, bigIntNum);
    expect(result).toEqual(197168812240000n);
  });
});
