import { hexlify, hexZeroPad } from "ethers/lib/utils";

export const ADDRESS_ZERO_BYTES32 = hexZeroPad(hexlify(0), 32);
