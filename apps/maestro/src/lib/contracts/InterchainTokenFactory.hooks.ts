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

import ABI from "./InterchainTokenFactory.abi";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainTokenFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenFactoryABI = ABI.abi;

export const interchainTokenFactoryAddress =
  "0xe93462bc7Ef7692D763C4d4DbCE7B870c0958c59" as const;

export const interchainTokenFactoryConfig = {
  address: interchainTokenFactoryAddress,
  abi: interchainTokenFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"canonicalInterchainTokenId"`.
 */
export function useInterchainTokenFactoryCanonicalInterchainTokenId<
  TFunctionName extends "canonicalInterchainTokenId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "canonicalInterchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"canonicalInterchainTokenSalt"`.
 */
export function useInterchainTokenFactoryCanonicalInterchainTokenSalt<
  TFunctionName extends "canonicalInterchainTokenSalt",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "canonicalInterchainTokenSalt",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"chainNameHash"`.
 */
export function useInterchainTokenFactoryChainNameHash<
  TFunctionName extends "chainNameHash",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "chainNameHash",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"contractId"`.
 */
export function useInterchainTokenFactoryContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"implementation"`.
 */
export function useInterchainTokenFactoryImplementation<
  TFunctionName extends "implementation",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "implementation",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenAddress"`.
 */
export function useInterchainTokenFactoryInterchainTokenAddress<
  TFunctionName extends "interchainTokenAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "interchainTokenAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useInterchainTokenFactoryInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenSalt"`.
 */
export function useInterchainTokenFactoryInterchainTokenSalt<
  TFunctionName extends "interchainTokenSalt",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "interchainTokenSalt",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"owner"`.
 */
export function useInterchainTokenFactoryOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"pendingOwner"`.
 */
export function useInterchainTokenFactoryPendingOwner<
  TFunctionName extends "pendingOwner",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "pendingOwner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"service"`.
 */
export function useInterchainTokenFactoryService<
  TFunctionName extends "service",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "service",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    TFunctionName,
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function useInterchainTokenFactoryAcceptOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "acceptOwnership"
        >["request"]["abi"],
        "acceptOwnership",
        TMode
      > & { functionName?: "acceptOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "acceptOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "acceptOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "acceptOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployInterchainToken"
        >["request"]["abi"],
        "deployInterchainToken",
        TMode
      > & { functionName?: "deployInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployRemoteCanonicalInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployRemoteCanonicalInterchainToken"
        >["request"]["abi"],
        "deployRemoteCanonicalInterchainToken",
        TMode
      > & { functionName?: "deployRemoteCanonicalInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployRemoteCanonicalInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployRemoteCanonicalInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployRemoteCanonicalInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployRemoteCanonicalInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployRemoteInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployRemoteInterchainToken"
        >["request"]["abi"],
        "deployRemoteInterchainToken",
        TMode
      > & { functionName?: "deployRemoteInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployRemoteInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployRemoteInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployRemoteInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployRemoteInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useInterchainTokenFactoryInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "interchainTransfer",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"multicall"`.
 */
export function useInterchainTokenFactoryMulticall<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "multicall"
        >["request"]["abi"],
        "multicall",
        TMode
      > & { functionName?: "multicall" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "multicall",
        TMode
      > & {
        abi?: never;
        functionName?: "multicall";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "multicall", TMode>(
    {
      abi: interchainTokenFactoryABI,
      address: interchainTokenFactoryAddress,
      functionName: "multicall",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function useInterchainTokenFactoryProposeOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "proposeOwnership"
        >["request"]["abi"],
        "proposeOwnership",
        TMode
      > & { functionName?: "proposeOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "proposeOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "proposeOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "proposeOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"registerCanonicalInterchainToken"`.
 */
export function useInterchainTokenFactoryRegisterCanonicalInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "registerCanonicalInterchainToken"
        >["request"]["abi"],
        "registerCanonicalInterchainToken",
        TMode
      > & { functionName?: "registerCanonicalInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "registerCanonicalInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "registerCanonicalInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "registerCanonicalInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "registerCanonicalInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"setup"`.
 */
export function useInterchainTokenFactorySetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "setup", TMode>({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenApprove"`.
 */
export function useInterchainTokenFactoryTokenApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "tokenApprove"
        >["request"]["abi"],
        "tokenApprove",
        TMode
      > & { functionName?: "tokenApprove" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "tokenApprove",
        TMode
      > & {
        abi?: never;
        functionName?: "tokenApprove";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "tokenApprove",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "tokenApprove",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenTransferFrom"`.
 */
export function useInterchainTokenFactoryTokenTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "tokenTransferFrom"
        >["request"]["abi"],
        "tokenTransferFrom",
        TMode
      > & { functionName?: "tokenTransferFrom" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "tokenTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "tokenTransferFrom";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "tokenTransferFrom",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "tokenTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useInterchainTokenFactoryTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "transferOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "transferOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"upgrade"`.
 */
export function useInterchainTokenFactoryUpgrade<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "upgrade"
        >["request"]["abi"],
        "upgrade",
        TMode
      > & { functionName?: "upgrade" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "upgrade",
        TMode
      > & {
        abi?: never;
        functionName?: "upgrade";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "upgrade", TMode>({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "upgrade",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function usePrepareInterchainTokenFactoryWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName
    >,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function usePrepareInterchainTokenFactoryAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "acceptOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "acceptOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "acceptOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployRemoteCanonicalInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployRemoteCanonicalInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployRemoteCanonicalInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployRemoteCanonicalInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployRemoteInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployRemoteInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "deployRemoteInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployRemoteInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareInterchainTokenFactoryInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "interchainTransfer"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"multicall"`.
 */
export function usePrepareInterchainTokenFactoryMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "multicall"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "multicall",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "multicall">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function usePrepareInterchainTokenFactoryProposeOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "proposeOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "proposeOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "proposeOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"registerCanonicalInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryRegisterCanonicalInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "registerCanonicalInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "registerCanonicalInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "registerCanonicalInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareInterchainTokenFactorySetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "setup">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenApprove"`.
 */
export function usePrepareInterchainTokenFactoryTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "tokenApprove"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "tokenApprove",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "tokenApprove">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenTransferFrom"`.
 */
export function usePrepareInterchainTokenFactoryTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "tokenTransferFrom"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "tokenTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "tokenTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareInterchainTokenFactoryTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "transferOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "transferOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"upgrade"`.
 */
export function usePrepareInterchainTokenFactoryUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "upgrade">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    functionName: "upgrade",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "upgrade">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenFactoryABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"OwnershipTransferStarted"`.
 */
export function useInterchainTokenFactoryOwnershipTransferStartedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenFactoryABI,
      "OwnershipTransferStarted"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    eventName: "OwnershipTransferStarted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "OwnershipTransferStarted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useInterchainTokenFactoryOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenFactoryABI,
      "OwnershipTransferred"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useInterchainTokenFactoryUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenFactoryABI, "Upgraded">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    address: interchainTokenFactoryAddress,
    eventName: "Upgraded",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "Upgraded">);
}
