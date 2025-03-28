import { MAINNET_AXELARSCAN_URL, TESTNET_AXELARSCAN_URL } from "./constants";

export const isNumericInput = (input: string) => /^\d*\.?\d*$/.test(input);

export const getAxelarscanBaseURL = () =>
  process.env.NEXT_PUBLIC_IS_TESTNET === "true"
    ? TESTNET_AXELARSCAN_URL
    : MAINNET_AXELARSCAN_URL;

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateEthAddress = function (address: `0x${string}`) {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return match[1] + "\u2026" + match[2];
};
