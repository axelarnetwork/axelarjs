import { formatUnits } from "viem";

export const toNumericString = (num: bigint, decimals = 18) =>
  Number(formatUnits(num, decimals)).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
