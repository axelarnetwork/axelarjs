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

import ABI from "./InterchainTokenService.abi";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainTokenService
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenServiceABI = ABI.abi;

export const interchainTokenServiceAddress =
  "0xa4A9965149388c86E62CDDDd6C95EFe9c294005a" as const;

export const interchainTokenServiceConfig = {
  address: interchainTokenServiceAddress,
  abi: interchainTokenServiceABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function useInterchainTokenServiceRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"chainName"`.
 */
export function useInterchainTokenServiceChainName<
  TFunctionName extends "chainName",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "chainName",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"chainNameHash"`.
 */
export function useInterchainTokenServiceChainNameHash<
  TFunctionName extends "chainNameHash",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "chainNameHash",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"contractCallValue"`.
 */
export function useInterchainTokenServiceContractCallValue<
  TFunctionName extends "contractCallValue",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "contractCallValue",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"contractCallWithTokenValue"`.
 */
export function useInterchainTokenServiceContractCallWithTokenValue<
  TFunctionName extends "contractCallWithTokenValue",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "contractCallWithTokenValue",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"contractId"`.
 */
export function useInterchainTokenServiceContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"executeWithToken"`.
 */
export function useInterchainTokenServiceExecuteWithToken<
  TFunctionName extends "executeWithToken",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "executeWithToken",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useInterchainTokenServiceFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useInterchainTokenServiceFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useInterchainTokenServiceFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"gasService"`.
 */
export function useInterchainTokenServiceGasService<
  TFunctionName extends "gasService",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "gasService",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"gateway"`.
 */
export function useInterchainTokenServiceGateway<
  TFunctionName extends "gateway",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "gateway",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"getExpressExecutor"`.
 */
export function useInterchainTokenServiceGetExpressExecutor<
  TFunctionName extends "getExpressExecutor",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "getExpressExecutor",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"getExpressExecutorWithToken"`.
 */
export function useInterchainTokenServiceGetExpressExecutorWithToken<
  TFunctionName extends "getExpressExecutorWithToken",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "getExpressExecutorWithToken",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"hasRole"`.
 */
export function useInterchainTokenServiceHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"implementation"`.
 */
export function useInterchainTokenServiceImplementation<
  TFunctionName extends "implementation",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "implementation",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTokenAddress"`.
 */
export function useInterchainTokenServiceInterchainTokenAddress<
  TFunctionName extends "interchainTokenAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTokenDeployer"`.
 */
export function useInterchainTokenServiceInterchainTokenDeployer<
  TFunctionName extends "interchainTokenDeployer",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenDeployer",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTokenFactory"`.
 */
export function useInterchainTokenServiceInterchainTokenFactory<
  TFunctionName extends "interchainTokenFactory",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenFactory",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useInterchainTokenServiceInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"isOperator"`.
 */
export function useInterchainTokenServiceIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"isTrustedAddress"`.
 */
export function useInterchainTokenServiceIsTrustedAddress<
  TFunctionName extends "isTrustedAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "isTrustedAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"owner"`.
 */
export function useInterchainTokenServiceOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"paused"`.
 */
export function useInterchainTokenServicePaused<
  TFunctionName extends "paused",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "paused",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"pendingOwner"`.
 */
export function useInterchainTokenServicePendingOwner<
  TFunctionName extends "pendingOwner",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "pendingOwner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"tokenHandler"`.
 */
export function useInterchainTokenServiceTokenHandler<
  TFunctionName extends "tokenHandler",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "tokenHandler",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"tokenManager"`.
 */
export function useInterchainTokenServiceTokenManager<
  TFunctionName extends "tokenManager",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "tokenManager",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"tokenManagerAddress"`.
 */
export function useInterchainTokenServiceTokenManagerAddress<
  TFunctionName extends "tokenManagerAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"tokenManagerDeployer"`.
 */
export function useInterchainTokenServiceTokenManagerDeployer<
  TFunctionName extends "tokenManagerDeployer",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerDeployer",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"tokenManagerImplementation"`.
 */
export function useInterchainTokenServiceTokenManagerImplementation<
  TFunctionName extends "tokenManagerImplementation",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerImplementation",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"trustedAddress"`.
 */
export function useInterchainTokenServiceTrustedAddress<
  TFunctionName extends "trustedAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "trustedAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"trustedAddressHash"`.
 */
export function useInterchainTokenServiceTrustedAddressHash<
  TFunctionName extends "trustedAddressHash",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "trustedAddressHash",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"validTokenAddress"`.
 */
export function useInterchainTokenServiceValidTokenAddress<
  TFunctionName extends "validTokenAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "validTokenAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"validTokenManagerAddress"`.
 */
export function useInterchainTokenServiceValidTokenManagerAddress<
  TFunctionName extends "validTokenManagerAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenServiceABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenServiceABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "validTokenManagerAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenServiceABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function useInterchainTokenServiceWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    TFunctionName,
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useInterchainTokenServiceAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "acceptOperatorship",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function useInterchainTokenServiceAcceptOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "acceptOwnership"
        >["request"]["abi"],
        "acceptOwnership",
        TMode
      > & { functionName?: "acceptOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "acceptOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "acceptOwnership",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "acceptOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useInterchainTokenServiceCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function useInterchainTokenServiceDeployInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "deployInterchainToken"
        >["request"]["abi"],
        "deployInterchainToken",
        TMode
      > & { functionName?: "deployInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "deployInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "deployInterchainToken",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "deployInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"deployTokenManager"`.
 */
export function useInterchainTokenServiceDeployTokenManager<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "deployTokenManager"
        >["request"]["abi"],
        "deployTokenManager",
        TMode
      > & { functionName?: "deployTokenManager" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "deployTokenManager",
        TMode
      > & {
        abi?: never;
        functionName?: "deployTokenManager";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "deployTokenManager",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "deployTokenManager",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"execute"`.
 */
export function useInterchainTokenServiceExecute<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "execute"
        >["request"]["abi"],
        "execute",
        TMode
      > & { functionName?: "execute" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "execute",
        TMode
      > & {
        abi?: never;
        functionName?: "execute";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenServiceABI, "execute", TMode>({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "execute",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"expressExecute"`.
 */
export function useInterchainTokenServiceExpressExecute<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "expressExecute"
        >["request"]["abi"],
        "expressExecute",
        TMode
      > & { functionName?: "expressExecute" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "expressExecute",
        TMode
      > & {
        abi?: never;
        functionName?: "expressExecute";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "expressExecute",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "expressExecute",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"expressExecuteWithToken"`.
 */
export function useInterchainTokenServiceExpressExecuteWithToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "expressExecuteWithToken"
        >["request"]["abi"],
        "expressExecuteWithToken",
        TMode
      > & { functionName?: "expressExecuteWithToken" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "expressExecuteWithToken",
        TMode
      > & {
        abi?: never;
        functionName?: "expressExecuteWithToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "expressExecuteWithToken",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "expressExecuteWithToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useInterchainTokenServiceInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "interchainTransfer",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"multicall"`.
 */
export function useInterchainTokenServiceMulticall<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "multicall"
        >["request"]["abi"],
        "multicall",
        TMode
      > & { functionName?: "multicall" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "multicall",
        TMode
      > & {
        abi?: never;
        functionName?: "multicall";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenServiceABI, "multicall", TMode>(
    {
      abi: interchainTokenServiceABI,
      address: interchainTokenServiceAddress,
      functionName: "multicall",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useInterchainTokenServiceProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "proposeOperatorship",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "proposeOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function useInterchainTokenServiceProposeOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "proposeOwnership"
        >["request"]["abi"],
        "proposeOwnership",
        TMode
      > & { functionName?: "proposeOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "proposeOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "proposeOwnership",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "proposeOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"removeTrustedAddress"`.
 */
export function useInterchainTokenServiceRemoveTrustedAddress<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "removeTrustedAddress"
        >["request"]["abi"],
        "removeTrustedAddress",
        TMode
      > & { functionName?: "removeTrustedAddress" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "removeTrustedAddress",
        TMode
      > & {
        abi?: never;
        functionName?: "removeTrustedAddress";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "removeTrustedAddress",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "removeTrustedAddress",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setFlowLimits"`.
 */
export function useInterchainTokenServiceSetFlowLimits<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "setFlowLimits"
        >["request"]["abi"],
        "setFlowLimits",
        TMode
      > & { functionName?: "setFlowLimits" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "setFlowLimits",
        TMode
      > & {
        abi?: never;
        functionName?: "setFlowLimits";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "setFlowLimits",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setFlowLimits",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setPauseStatus"`.
 */
export function useInterchainTokenServiceSetPauseStatus<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "setPauseStatus"
        >["request"]["abi"],
        "setPauseStatus",
        TMode
      > & { functionName?: "setPauseStatus" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "setPauseStatus",
        TMode
      > & {
        abi?: never;
        functionName?: "setPauseStatus";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "setPauseStatus",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setPauseStatus",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setTrustedAddress"`.
 */
export function useInterchainTokenServiceSetTrustedAddress<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "setTrustedAddress"
        >["request"]["abi"],
        "setTrustedAddress",
        TMode
      > & { functionName?: "setTrustedAddress" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "setTrustedAddress",
        TMode
      > & {
        abi?: never;
        functionName?: "setTrustedAddress";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "setTrustedAddress",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setTrustedAddress",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setup"`.
 */
export function useInterchainTokenServiceSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenServiceABI, "setup", TMode>({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useInterchainTokenServiceTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "transferOperatorship",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useInterchainTokenServiceTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "transferOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "transferOwnership",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useInterchainTokenServiceTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenServiceABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"upgrade"`.
 */
export function useInterchainTokenServiceUpgrade<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenServiceABI,
          "upgrade"
        >["request"]["abi"],
        "upgrade",
        TMode
      > & { functionName?: "upgrade" }
    : UseContractWriteConfig<
        typeof interchainTokenServiceABI,
        "upgrade",
        TMode
      > & {
        abi?: never;
        functionName?: "upgrade";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenServiceABI, "upgrade", TMode>({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "upgrade",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function usePrepareInterchainTokenServiceWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      TFunctionName
    >,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareInterchainTokenServiceAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "acceptOperatorship"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function usePrepareInterchainTokenServiceAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "acceptOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "acceptOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "acceptOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareInterchainTokenServiceCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function usePrepareInterchainTokenServiceDeployInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "deployInterchainToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "deployInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "deployInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"deployTokenManager"`.
 */
export function usePrepareInterchainTokenServiceDeployTokenManager(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "deployTokenManager"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "deployTokenManager",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "deployTokenManager">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"execute"`.
 */
export function usePrepareInterchainTokenServiceExecute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "execute">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "execute",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "execute">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"expressExecute"`.
 */
export function usePrepareInterchainTokenServiceExpressExecute(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "expressExecute"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "expressExecute",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "expressExecute">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"expressExecuteWithToken"`.
 */
export function usePrepareInterchainTokenServiceExpressExecuteWithToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "expressExecuteWithToken"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "expressExecuteWithToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "expressExecuteWithToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareInterchainTokenServiceInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "interchainTransfer"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"multicall"`.
 */
export function usePrepareInterchainTokenServiceMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "multicall"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "multicall",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "multicall">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareInterchainTokenServiceProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "proposeOperatorship"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function usePrepareInterchainTokenServiceProposeOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "proposeOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "proposeOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "proposeOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"removeTrustedAddress"`.
 */
export function usePrepareInterchainTokenServiceRemoveTrustedAddress(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "removeTrustedAddress"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "removeTrustedAddress",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "removeTrustedAddress">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setFlowLimits"`.
 */
export function usePrepareInterchainTokenServiceSetFlowLimits(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "setFlowLimits"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setFlowLimits",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "setFlowLimits">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setPauseStatus"`.
 */
export function usePrepareInterchainTokenServiceSetPauseStatus(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "setPauseStatus"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setPauseStatus",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "setPauseStatus">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setTrustedAddress"`.
 */
export function usePrepareInterchainTokenServiceSetTrustedAddress(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "setTrustedAddress"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setTrustedAddress",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "setTrustedAddress">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareInterchainTokenServiceSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "setup">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareInterchainTokenServiceTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "transferOperatorship"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareInterchainTokenServiceTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "transferOwnership"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "transferOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareInterchainTokenServiceTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenServiceABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `functionName` set to `"upgrade"`.
 */
export function usePrepareInterchainTokenServiceUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "upgrade">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    functionName: "upgrade",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenServiceABI, "upgrade">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function useInterchainTokenServiceEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"ExpressExecuted"`.
 */
export function useInterchainTokenServiceExpressExecutedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "ExpressExecuted">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecuted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "ExpressExecuted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"ExpressExecutedWithToken"`.
 */
export function useInterchainTokenServiceExpressExecutedWithTokenEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "ExpressExecutedWithToken"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutedWithToken",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "ExpressExecutedWithToken">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"ExpressExecutionFulfilled"`.
 */
export function useInterchainTokenServiceExpressExecutionFulfilledEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "ExpressExecutionFulfilled"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutionFulfilled",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "ExpressExecutionFulfilled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"ExpressExecutionWithTokenFulfilled"`.
 */
export function useInterchainTokenServiceExpressExecutionWithTokenFulfilledEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "ExpressExecutionWithTokenFulfilled"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutionWithTokenFulfilled",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "ExpressExecutionWithTokenFulfilled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"InterchainTokenDeployed"`.
 */
export function useInterchainTokenServiceInterchainTokenDeployedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "InterchainTokenDeployed"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenDeployed",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "InterchainTokenDeployed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"InterchainTokenDeploymentStarted"`.
 */
export function useInterchainTokenServiceInterchainTokenDeploymentStartedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "InterchainTokenDeploymentStarted"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenDeploymentStarted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "InterchainTokenDeploymentStarted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"InterchainTokenIdClaimed"`.
 */
export function useInterchainTokenServiceInterchainTokenIdClaimedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "InterchainTokenIdClaimed"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenIdClaimed",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "InterchainTokenIdClaimed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"InterchainTransfer"`.
 */
export function useInterchainTokenServiceInterchainTransferEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "InterchainTransfer"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTransfer",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "InterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"InterchainTransferReceived"`.
 */
export function useInterchainTokenServiceInterchainTransferReceivedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "InterchainTransferReceived"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTransferReceived",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "InterchainTransferReceived">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"OwnershipTransferStarted"`.
 */
export function useInterchainTokenServiceOwnershipTransferStartedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "OwnershipTransferStarted"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "OwnershipTransferStarted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "OwnershipTransferStarted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useInterchainTokenServiceOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "OwnershipTransferred"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"Paused"`.
 */
export function useInterchainTokenServicePausedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "Paused">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "Paused",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "Paused">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useInterchainTokenServiceRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "RolesAdded">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useInterchainTokenServiceRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "RolesProposed">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useInterchainTokenServiceRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "RolesRemoved">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "RolesRemoved">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"TokenManagerDeployed"`.
 */
export function useInterchainTokenServiceTokenManagerDeployedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "TokenManagerDeployed"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "TokenManagerDeployed",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "TokenManagerDeployed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"TokenManagerDeploymentStarted"`.
 */
export function useInterchainTokenServiceTokenManagerDeploymentStartedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "TokenManagerDeploymentStarted"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "TokenManagerDeploymentStarted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "TokenManagerDeploymentStarted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"TrustedAddressRemoved"`.
 */
export function useInterchainTokenServiceTrustedAddressRemovedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "TrustedAddressRemoved"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "TrustedAddressRemoved",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "TrustedAddressRemoved">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"TrustedAddressSet"`.
 */
export function useInterchainTokenServiceTrustedAddressSetEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenServiceABI,
      "TrustedAddressSet"
    >,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "TrustedAddressSet",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "TrustedAddressSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"Unpaused"`.
 */
export function useInterchainTokenServiceUnpausedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "Unpaused">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "Unpaused",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "Unpaused">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenServiceABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useInterchainTokenServiceUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenServiceABI, "Upgraded">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    eventName: "Upgraded",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenServiceABI, "Upgraded">);
}
