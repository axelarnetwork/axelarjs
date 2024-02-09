import { reduce } from "ramda";

export { default as ascend } from "ramda/src/ascend";
export { default as descend } from "ramda/src/descend";
export { default as sortWith } from "ramda/src/sortWith";
export { default as memoizeWith } from "ramda/src/memoizeWith";

export const toSum = reduce<bigint, bigint>((a, b) => a + b, 0n);
