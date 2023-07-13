import { getAddress } from "viem";

/**
 * type guard for EVM addresses
 * @param address The address to check.
 */
export const isValidEVMAddress = (
  address: string
): address is `0x${string}` => {
  try {
    return typeof getAddress(address) === "string";
  } catch (error) {
    return false;
  }
};

export const VALID_NON_NUMERIC_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Home",
  "End",
];

/**
 * type guard for numeric keys
 *
 * @param key The key to check.
 * @returns true if the key is a valid numeric key.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
export const isValidNumericKey = (key: string) =>
  VALID_NON_NUMERIC_KEYS.includes(key) || /^[0-9.]+$/.test(key);

export const preventNonNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (!isValidNumericKey(e.key)) {
    e.preventDefault();
  }
};
