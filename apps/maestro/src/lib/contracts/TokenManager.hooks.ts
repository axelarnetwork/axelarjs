/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useContractEvent,
  UseContractEventConfig,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
} from "wagmi";
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions";

import ABI from "./TokenManager.abi";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerABI = ABI.abi;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__.
 */
export function useTokenManagerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"contractId"`.
 */
export function useTokenManagerContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useTokenManagerFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useTokenManagerFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useTokenManagerFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"getTokenAddressFromParams"`.
 */
export function useTokenManagerGetTokenAddressFromParams<
  TFunctionName extends "getTokenAddressFromParams",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "getTokenAddressFromParams",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenManagerHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"implementationType"`.
 */
export function useTokenManagerImplementationType<
  TFunctionName extends "implementationType",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "implementationType",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useTokenManagerInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"interchainTokenService"`.
 */
export function useTokenManagerInterchainTokenService<
  TFunctionName extends "interchainTokenService",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "interchainTokenService",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"isOperator"`.
 */
export function useTokenManagerIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"tokenAddress"`.
 */
export function useTokenManagerTokenAddress<
  TFunctionName extends "tokenAddress",
  TSelectData = ReadContractResult<typeof tokenManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerABI,
    functionName: "tokenAddress",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__.
 */
export function useTokenManagerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof tokenManagerABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, TFunctionName, TMode>({
    abi: tokenManagerABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useTokenManagerAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "acceptOperatorship", TMode>({
    abi: tokenManagerABI,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function useTokenManagerAddFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "addFlowLimiter"
        >["request"]["abi"],
        "addFlowLimiter",
        TMode
      > & { functionName?: "addFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "addFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "addFlowLimiter";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "addFlowLimiter", TMode>({
    abi: tokenManagerABI,
    functionName: "addFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useTokenManagerCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: tokenManagerABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"giveToken"`.
 */
export function useTokenManagerGiveToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "giveToken"
        >["request"]["abi"],
        "giveToken",
        TMode
      > & { functionName?: "giveToken" }
    : UseContractWriteConfig<typeof tokenManagerABI, "giveToken", TMode> & {
        abi?: never;
        functionName?: "giveToken";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "giveToken", TMode>({
    abi: tokenManagerABI,
    functionName: "giveToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useTokenManagerInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "interchainTransfer", TMode>({
    abi: tokenManagerABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useTokenManagerProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "proposeOperatorship", TMode>(
    {
      abi: tokenManagerABI,
      functionName: "proposeOperatorship",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function useTokenManagerRemoveFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "removeFlowLimiter"
        >["request"]["abi"],
        "removeFlowLimiter",
        TMode
      > & { functionName?: "removeFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "removeFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "removeFlowLimiter";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "removeFlowLimiter", TMode>({
    abi: tokenManagerABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function useTokenManagerSetFlowLimit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "setFlowLimit"
        >["request"]["abi"],
        "setFlowLimit",
        TMode
      > & { functionName?: "setFlowLimit" }
    : UseContractWriteConfig<typeof tokenManagerABI, "setFlowLimit", TMode> & {
        abi?: never;
        functionName?: "setFlowLimit";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "setFlowLimit", TMode>({
    abi: tokenManagerABI,
    functionName: "setFlowLimit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"setup"`.
 */
export function useTokenManagerSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<typeof tokenManagerABI, "setup", TMode> & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "setup", TMode>({
    abi: tokenManagerABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"takeToken"`.
 */
export function useTokenManagerTakeToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "takeToken"
        >["request"]["abi"],
        "takeToken",
        TMode
      > & { functionName?: "takeToken" }
    : UseContractWriteConfig<typeof tokenManagerABI, "takeToken", TMode> & {
        abi?: never;
        functionName?: "takeToken";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerABI, "takeToken", TMode>({
    abi: tokenManagerABI,
    functionName: "takeToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useTokenManagerTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerABI,
    "transferOperatorship",
    TMode
  >({
    abi: tokenManagerABI,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useTokenManagerTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: tokenManagerABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__.
 */
export function usePrepareTokenManagerWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareTokenManagerAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "acceptOperatorship">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function usePrepareTokenManagerAddFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "addFlowLimiter">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "addFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "addFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareTokenManagerCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"giveToken"`.
 */
export function usePrepareTokenManagerGiveToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "giveToken">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "giveToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "giveToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareTokenManagerInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "interchainTransfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareTokenManagerProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerABI,
      "proposeOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function usePrepareTokenManagerRemoveFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "removeFlowLimiter">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "removeFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function usePrepareTokenManagerSetFlowLimit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "setFlowLimit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "setFlowLimit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "setFlowLimit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareTokenManagerSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"takeToken"`.
 */
export function usePrepareTokenManagerTakeToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerABI, "takeToken">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "takeToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "takeToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareTokenManagerTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerABI,
      "transferOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareTokenManagerTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerABI}__.
 */
export function useTokenManagerEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerABI,
    ...config,
  } as UseContractEventConfig<typeof tokenManagerABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerABI}__ and `eventName` set to `"FlowLimitSet"`.
 */
export function useTokenManagerFlowLimitSetEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerABI, "FlowLimitSet">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerABI,
    eventName: "FlowLimitSet",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerABI, "FlowLimitSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useTokenManagerRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useTokenManagerRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerABI, "RolesProposed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useTokenManagerRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerABI, "RolesRemoved">);
}
