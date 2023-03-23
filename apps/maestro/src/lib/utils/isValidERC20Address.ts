import { getAddress } from "ethers/lib/utils.js";

export const isValidAddress = (address: string): address is `0x${string}` => {
  try {
    return typeof getAddress(address) === "string";
  } catch (error) {
    return false;
  }
};
