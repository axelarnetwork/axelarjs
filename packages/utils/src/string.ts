export const isNilOrWhitespace = (
  value: string | undefined | null
): value is undefined | null => (value?.trim() ?? "") === "";

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase().concat(value.slice(1));

export const sluggify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const unSluggify = (value: string) =>
  value.split("-").map(capitalize).join(" ");

export const maskAddress = (
  address: `0x${string}`,
  opts?: {
    segmentA: number;
    segmentB: number;
  }
) =>
  `${address.slice(0, opts?.segmentA ?? 6)}...${address.slice(
    opts?.segmentB ?? -4
  )}`;

export function generateRandomHash(bits: 8 | 16 | 24 | 32 = 32): `0x${string}` {
  const bytes = window.crypto.getRandomValues(new Uint8Array(bits));

  const hash = bytes.reduce(
    (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
    ""
  );

  return `0x${hash}`;
}
/**
 * Compare two strings, ignoring case
 *
 * @param a
 * @param b
 * @returns
 */
export function caseInsensitiveEqual(
  a: string | undefined,
  b: string | undefined
) {
  return a?.toLowerCase() === b?.toLowerCase();
}

/**
 * Locale compare two strings. a.localeCompare(b)
 * @param a string
 * @param b string
 * @returns number
 */
export const localeCompare = (a: string, b: string) => a.localeCompare(b);
