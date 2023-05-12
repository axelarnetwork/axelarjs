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
