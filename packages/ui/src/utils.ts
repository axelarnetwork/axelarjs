import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS classnames combiner
 * @param inputs
 * @returns Tailwind CSS classnames
 *
 * @example
 * ```ts
 * import { cn } from "@axelarjs/ui";
 *
 * const className = cn("text-red-500", "bg-blue-500");
 * // className = "text-red-500 bg-blue-500"
 * ```
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
