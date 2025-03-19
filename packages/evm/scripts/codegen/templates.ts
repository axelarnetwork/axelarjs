import { capitalize } from "@axelarjs/utils/string";

import type { ABIItem } from "./types";
import { parseInputType } from "./utils";

export const INDEX_FILE = ({
  fileName = "",
  constantName = "",
  pascalName = "",
  clientPath = "",
  hasArgs = false,
  hasReadFns = false,
}) => `
  import { Chain } from "viem";

  import { PublicContractClient } from "${clientPath}";
  import ABI_FILE from "./${fileName}.abi";
  ${
    hasReadFns && hasArgs
      ? `import { create${pascalName}ReadClient } from "./${fileName}.args";`
      : ""
  }
  
  ${hasReadFns ? `const createReadClient = create${pascalName}ReadClient;` : ""}
  
  ${hasArgs ? `export * from "./${fileName}.args";` : ""}

  export const ${constantName}_ABI = ABI_FILE.abi;
  
  /**
   * ${pascalName}Client
   * 
   * @description Type-safe contract client for ${pascalName}
   * 
   * @example
   * 
   * import { sepolia } from "viem/chains";
   * 
   * const client = create${pascalName}Client({
   *  chain: sepolia,
   *  address: "0x1234..."
   * });
   */
  export class ${pascalName}Client extends PublicContractClient<
    typeof ABI_FILE.abi
  > {
    static ABI = ABI_FILE.abi;
    static contractName = ABI_FILE.contractName;

    ${
      hasReadFns
        ? `public readonly reads: ReturnType<typeof createReadClient>;`
        : ""
    }
  
    constructor(options: { chain: Chain; address: \`0x\${string}\` }) {
      super({
        abi: ${constantName}_ABI,
        address: options.address,
        chain: options.chain,
      });

      ${hasReadFns ? `this.reads = createReadClient(this);` : ""}
    }
  }
  
  export const create${pascalName}Client = (options: { chain: Chain; address: \`0x\${string}\` }) => new ${pascalName}Client(options);
  `;

// Helper function to handle overloaded functions
function handleOverloadedFunctions(abi: ABIItem[]) {
  const functionGroups = new Map<string, ABIItem[]>();
  
  abi.forEach((item) => {
    if (item.type === 'function') {
      const existing = functionGroups.get(item.name) || [];
      functionGroups.set(item.name, [...existing, item]);
    }
  });

  // Create mapping for unique names
  const uniqueFunctionNames = new Map<string, {baseName: string, suffix: string}>();
  
  functionGroups.forEach((items, functionName) => {
    if (items.length > 1) {
      // Sort by number of inputs (fewer inputs get lower numbers)
      const sortedItems = [...items].sort((a, b) => a.inputs.length - b.inputs.length);
      
      sortedItems.forEach((item, index) => {
        const key = JSON.stringify({ name: item.name, inputs: item.inputs });
        const suffix = index === 0 ? '' : String(index + 1);
        uniqueFunctionNames.set(key, {
          baseName: functionName,
          suffix
        });
      });
    }
  });

  return {
    getUniqueName: (item: ABIItem) => {
      const key = JSON.stringify({ name: item.name, inputs: item.inputs });
      return uniqueFunctionNames.get(key) || { baseName: item.name, suffix: '' };
    }
  };
}

function getDefaultArgName(functionName: string, argIndex: number) {
  if (functionName === "allowance") {
    return ["owner", "spender"][argIndex];
  }
  return `${functionName}Arg${argIndex}`;
}

export const ARGS_FILE = ({
  pascalName = "",
  abiFns = [] as ABIItem[],
  readFns = [] as ABIItem[],
  fileName = "",
  constantName = "",
  clientPath = "",
}) => {
  const { getUniqueName } = handleOverloadedFunctions(abiFns);

  const toABIFnEncoder = ({ name, inputs }: ABIItem) => {
    const argNames = inputs
      .map((input, i) => input.name || getDefaultArgName(name, i))
      .join(", ");

    const argsType = inputs
      .map(
        (input, i) =>
          `${input.name || getDefaultArgName(name, i)}: ${parseInputType(
            input
          )}`
      )
      .join("; ");

    const { baseName, suffix } = getUniqueName({ name, inputs, type: 'function' });
    
    const fnName = capitalize(baseName);
    const typeName = `${pascalName}${fnName}Args${suffix}`;
    const encoderName = `${fnName}${suffix}`;

    return `
      export type ${typeName} = {${argsType}}
      
      /**
       * Factory function for ${pascalName}.${name} function args
       */
      export const encode${pascalName}${encoderName}Args = ({${argNames}}: ${typeName}) => [${argNames}] as const;
      
      /**
       * Encoder function for ${pascalName}.${name} function data
       */
      export const encode${pascalName}${encoderName}Data = ({${argNames}}: ${typeName}): \`0x\${string}\` => encodeFunctionData({
        functionName: "${name}",
        abi: ABI_FILE.abi,
        args: [${argNames}]
      });`;
  };

  const readsClient = readFns?.length
    ? `export function create${pascalName}ReadClient(
        publicClient: PublicContractClient<typeof ABI_FILE.abi>
      ) {
        return {
          ${readFns
            .map(({ name, inputs }) => {
              const { baseName, suffix } = getUniqueName({ name, inputs, type: 'function' });
              const encoderName = `${baseName}${suffix}`;
              
              return inputs.length > 0
                ? `"${encoderName}"(${name}Args: ${pascalName}${capitalize(baseName)}Args${suffix}) {
                    const encoder = ${constantName}_ENCODERS["${encoderName}"];
                    const encodedArgs = encoder.args(${name}Args);

                    return publicClient.read("${name}", { args: encodedArgs });
                  }`
                : `"${name}"() {
                    return publicClient.read("${name}");
                  }`;
            })
            .join(",\n")}
        }
      }`
    : "";

  const abiFnsWithInputs = abiFns.filter((x) => x.inputs.length > 0);

  return `
    ${abiFnsWithInputs.length ? `import { encodeFunctionData } from "viem"` : ""};
    
    ${readFns.length > 0
        ? `import type { PublicContractClient } from "${
            clientPath.startsWith(".")
              ? "../../PublicContractClient"
              : "@axelarjs/evm"
          }";`
        : ""
    }
    import ABI_FILE from "./${fileName}.abi";

    ${abiFnsWithInputs.map(toABIFnEncoder).join("\n\n")}
      
    export const ${constantName}_ENCODERS = {
      ${abiFnsWithInputs
        .map(({ name, inputs }) => {
          const { baseName, suffix } = getUniqueName({ name, inputs, type: 'function' });
          const encoderName = `${baseName}${suffix}`;
          return `"${encoderName}": {
              args: encode${pascalName}${capitalize(encoderName)}Args,
              data: encode${pascalName}${capitalize(encoderName)}Data,
            }`;
        })
        .join(",\n")}
    }
    
    ${readsClient}`;
};

export const GENERATED_DISCLAIMER = ({ abiPath = "" }) => `
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * This file was generated by scripts/codegen.ts
   *
   * Original abi file:
   * - ${abiPath}
   *
   * DO NOT EDIT MANUALLY
   */
  `;
