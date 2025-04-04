/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseWriteContract,
  createUseSimulateContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20MintableBurnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MintableBurnableAbi = [
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__
 */
export const useWriteIerc20MintableBurnable =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc20MintableBurnableAbi });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteIerc20MintableBurnableBurn =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MintableBurnableAbi,
    functionName: "burn",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteIerc20MintableBurnableMint =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MintableBurnableAbi,
    functionName: "mint",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__
 */
export const useSimulateIerc20MintableBurnable =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc20MintableBurnableAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateIerc20MintableBurnableBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MintableBurnableAbi,
    functionName: "burn",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MintableBurnableAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateIerc20MintableBurnableMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MintableBurnableAbi,
    functionName: "mint",
  });
