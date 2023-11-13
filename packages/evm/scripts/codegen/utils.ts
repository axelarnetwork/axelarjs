import { convertCase } from "@axelarjs/utils/case-conversion";

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
