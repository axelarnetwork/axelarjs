import { parseUnits } from "viem";

export class BigNumberUtils {
  public static multiplyToGetWei(bn: bigint, number: string, units: number) {
    const numArr: string[] = number.split(".");
    if (numArr?.length < 2 || (numArr[1] as string)?.length <= units) {
      return bn * BigInt(parseUnits(number, units));
    } else {
      const multiplier = Math.pow(10, units);
      return (
        (bn * parseUnits((Number(number) * multiplier).toFixed(units), units)) /
        BigInt(multiplier)
      );
    }
  }
}
