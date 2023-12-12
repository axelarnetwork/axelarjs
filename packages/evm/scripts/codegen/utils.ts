import { convertCase } from "@axelarjs/utils/case-conversion";

import { ABIInputItem } from "./types";

export const pascalToKebabCase = convertCase("PascalCase", "kebab-case");
export const pascalToConstName = (contract = "") =>
  contract
    .replace(/([A-Z])/g, "_$1")
    .replace(/-/g, "_")
    .replace(/^_/, "")
    .toUpperCase()
    // handle ERC*, IERC* and Interface* names
    .replace(/^E_R_C/, "ERC")
    .replace(/^I_E_R_C/, "IERC")
    .replace(/^I_/, "I");

export function parseInputType(input: ABIInputItem) {
  switch (input.type) {
    // string types
    case "address":
    case "bytes32":
    case "bytes":
      return "`0x${string}`";
    case "string":
      return "string";
    // number types
    case "uint256":
      return "bigint";
    case "uint8":
      return "number";
    // boolean
    case "bool":
      return "boolean";
    // default
    default:
      return "any";
  }
}
