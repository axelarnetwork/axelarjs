import { formatEther } from "viem";

export const toNumericString = (num: bigint) =>
  Number(formatEther(num)).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
