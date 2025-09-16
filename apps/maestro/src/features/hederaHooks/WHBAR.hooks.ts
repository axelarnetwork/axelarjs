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
// WHBAR (Wrapped HBAR)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const whbarAbi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "address", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// WHBAR address will be dynamic based on the Hedera InterchainTokenService contract
// We'll get it from the contract's whbarAddress() function
export const getWhbarAddress = async (
  interchainTokenServiceAddress: `0x${string}`,
  publicClient: any
): Promise<`0x${string}`> => {
  const result = await publicClient.readContract({
    address: interchainTokenServiceAddress,
    abi: [
      {
        inputs: [],
        name: "whbarAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "whbarAddress",
  });
  return result as `0x${string}`;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link whbarAbi}__
 */
export const useReadWhbar = /*#__PURE__*/ createUseReadContract({
  abi: whbarAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadWhbarBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: whbarAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadWhbarAllowance = /*#__PURE__*/ createUseReadContract({
  abi: whbarAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteWhbarDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: whbarAbi,
  functionName: "deposit",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteWhbarWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: whbarAbi,
  functionName: "withdraw",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteWhbarApprove = /*#__PURE__*/ createUseWriteContract({
  abi: whbarAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link whbarAbi}__
 */
export const useWriteWhbar = /*#__PURE__*/ createUseWriteContract({
  abi: whbarAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteWhbarTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: whbarAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link whbarAbi}__
 */
export const useSimulateWhbar = /*#__PURE__*/ createUseSimulateContract({
  abi: whbarAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateWhbarTransfer = /*#__PURE__*/ createUseSimulateContract(
  {
    abi: whbarAbi,
    functionName: "transfer",
  }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateWhbarDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: whbarAbi,
  functionName: "deposit",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateWhbarWithdraw = /*#__PURE__*/ createUseSimulateContract(
  {
    abi: whbarAbi,
    functionName: "withdraw",
  }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link whbarAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateWhbarApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: whbarAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link whbarAbi}__
 */
export const useWatchWhbarEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: whbarAbi,
});
