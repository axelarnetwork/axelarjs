import { Maybe } from "@axelarjs/utils";

import { chalk } from "zx";

const COLORS = ["red", "green", "yellow", "blue", "magenta", "cyan"] as const;

/**
 * Split array at index
 *
 * @param {number} index
 */
const splitAt = <T>(index: number = 0, x: string | T[]) => [
  x.slice(0, index),
  x.slice(index),
];

/**
 * Rainbow text
 * @param {string} text
 *
 * @example
 *
 * console.log(rainbow("Hello World!"));
 *
 * // => "Hello World!"
 */
export function rainbow(text: string = ""): string {
  const rainbowRipple = [..."{{{}}}"]
    .map((x, i) =>
      Maybe.of(COLORS[i % COLORS.length]).mapOr(x, (color) => chalk[color](x)),
    )
    .join("");

  const [pre, pos] = splitAt(rainbowRipple.length / 2, rainbowRipple) as [
    string,
    string,
  ];

  return `${pre} ${text} ${pos}`;
}
