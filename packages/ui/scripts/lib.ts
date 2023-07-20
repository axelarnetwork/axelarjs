import chalk from "chalk";

const COLORS = ["red", "green", "yellow", "blue", "magenta", "cyan"] as const;

/**
 * Split array at index
 *
 * @param {number} index
 */
const splitAt =
  (index: number = 0) =>
  (x: string | any[]) =>
    [x.slice(0, index), x.slice(index)];

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
    .map((x, i) => chalk[COLORS[i % COLORS.length]](x))
    .join("");

  const [pre, pos] = splitAt(rainbowRipple.length / 2)(rainbowRipple);

  return `${pre} ${text} ${pos}`;
}
