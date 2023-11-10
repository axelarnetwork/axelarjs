/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  getContract,
  GetContractArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20MintableBurnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MintableBurnableABI = [
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ierc20MintableBurnableABI}__.
 */
export function getIerc20MintableBurnable(
  config: Omit<GetContractArgs, "abi">
) {
  return getContract({ abi: ierc20MintableBurnableABI, ...config });
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MintableBurnableABI}__.
 */
export function writeIerc20MintableBurnable<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<
          typeof ierc20MintableBurnableABI,
          TFunctionName
        >,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<
          typeof ierc20MintableBurnableABI,
          TFunctionName
        >,
        "abi"
      >
) {
  return writeContract({
    abi: ierc20MintableBurnableABI,
    ...config,
  } as unknown as WriteContractArgs<typeof ierc20MintableBurnableABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ierc20MintableBurnableABI}__.
 */
export function prepareWriteIerc20MintableBurnable<
  TAbi extends readonly unknown[] = typeof ierc20MintableBurnableABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: ierc20MintableBurnableABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}
