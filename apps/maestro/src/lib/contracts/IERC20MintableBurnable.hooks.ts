/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
} from "wagmi";
import { PrepareWriteContractResult, WriteContractMode } from "wagmi/actions";

import ABI from "./IERC20MintableBurnable.abi";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20MintableBurnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MintableBurnableABI = ABI.abi;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__.
 */
export function useIerc20MintableBurnableWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MintableBurnableABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof ierc20MintableBurnableABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof ierc20MintableBurnableABI,
    TFunctionName,
    TMode
  >({ abi: ierc20MintableBurnableABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__ and `functionName` set to `"burn"`.
 */
export function useIerc20MintableBurnableBurn<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MintableBurnableABI,
          "burn"
        >["request"]["abi"],
        "burn",
        TMode
      > & { functionName?: "burn" }
    : UseContractWriteConfig<
        typeof ierc20MintableBurnableABI,
        "burn",
        TMode
      > & {
        abi?: never;
        functionName?: "burn";
      } = {} as any
) {
  return useContractWrite<typeof ierc20MintableBurnableABI, "burn", TMode>({
    abi: ierc20MintableBurnableABI,
    functionName: "burn",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__ and `functionName` set to `"mint"`.
 */
export function useIerc20MintableBurnableMint<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MintableBurnableABI,
          "mint"
        >["request"]["abi"],
        "mint",
        TMode
      > & { functionName?: "mint" }
    : UseContractWriteConfig<
        typeof ierc20MintableBurnableABI,
        "mint",
        TMode
      > & {
        abi?: never;
        functionName?: "mint";
      } = {} as any
) {
  return useContractWrite<typeof ierc20MintableBurnableABI, "mint", TMode>({
    abi: ierc20MintableBurnableABI,
    functionName: "mint",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__.
 */
export function usePrepareIerc20MintableBurnableWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof ierc20MintableBurnableABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: ierc20MintableBurnableABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MintableBurnableABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareIerc20MintableBurnableBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MintableBurnableABI, "burn">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: ierc20MintableBurnableABI,
    functionName: "burn",
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MintableBurnableABI, "burn">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MintableBurnableABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareIerc20MintableBurnableMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MintableBurnableABI, "mint">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: ierc20MintableBurnableABI,
    functionName: "mint",
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MintableBurnableABI, "mint">);
}
