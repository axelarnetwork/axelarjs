import chalk from "chalk";
import { createInterface } from "readline/promises";
import R from "rambda/immutable";

/**
 * Prompt user for input
 *
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function prompt(
  message = "",
  options = ["y", "n"],
  defaultAnswer = "y"
) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const toOption = (x = "") => (x === defaultAnswer ? x.toUpperCase() : x);

  const answer = await rl
    .question(`${message}\n[${options.map(toOption).join("/")}]: `)
    .then(R.toLower);

  return options.includes(answer) ? answer : defaultAnswer;
}

const COLORS = ["red", "green", "yellow", "blue", "magenta", "cyan"];

/**
 * Split array at index
 *
 * @param {number} index
 * @returns {function}
 */
const splitAt =
  (index = 0) =>
  (x = []) =>
    [x.slice(0, index), x.slice(index)];

/**
 * Rainbow text
 * @param {string} text
 * @returns {string}
 *
 * @example
 *
 * console.log(rainbow("Hello World!"));
 *
 * // => "Hello World!"
 */
export function rainbow(text = "") {
  const rainbowRipple = [..."{{{}}}"]
    .map((x, i) => chalk[COLORS[i % COLORS.length]](x))
    .join("");

  const [pre, pos] = splitAt(rainbowRipple.length / 2)(rainbowRipple);

  return `${pre} ${text} ${pos}`;
}
