// This file is NOT auto-generated

/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HederaExchangeRatePrecompile
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const hederaExchangeRatePrecompileAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tinycents",
        type: "uint256",
      },
    ],
    name: "tinycentsToTinybars",
    outputs: [
      {
        internalType: "uint256",
        name: "tinybars",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tinybars",
        type: "uint256",
      },
    ],
    name: "tinybarsToTinycents",
    outputs: [
      {
        internalType: "uint256",
        name: "tinycents",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const hederaExchangeRatePrecompileAddress =
  "0x0000000000000000000000000000000000000168" as const;

export const hederaExchangeRatePrecompileConfig = {
  address: hederaExchangeRatePrecompileAddress,
  abi: hederaExchangeRatePrecompileAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__
 */
export const useReadHederaExchangeRatePrecompile =
  /*#__PURE__*/ createUseReadContract({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__ and `functionName` set to `"tinycentsToTinybars"`
 */
export const useReadHederaExchangeRatePrecompileTinycentsToTinybars =
  /*#__PURE__*/ createUseReadContract({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
    functionName: "tinycentsToTinybars",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__ and `functionName` set to `"tinybarsToTinycents"`
 */
export const useReadHederaExchangeRatePrecompileTinybarsToTinycents =
  /*#__PURE__*/ createUseReadContract({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
    functionName: "tinybarsToTinycents",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__
 */
export const useWriteHederaExchangeRatePrecompile =
  /*#__PURE__*/ createUseWriteContract({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__
 */
export const useSimulateHederaExchangeRatePrecompile =
  /*#__PURE__*/ createUseSimulateContract({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link hederaExchangeRatePrecompileAbi}__
 */
export const useWatchHederaExchangeRatePrecompileEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: hederaExchangeRatePrecompileAbi,
    address: hederaExchangeRatePrecompileAddress,
  });
