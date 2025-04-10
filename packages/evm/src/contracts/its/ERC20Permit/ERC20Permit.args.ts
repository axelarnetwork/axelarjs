/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file was generated by scripts/codegen.ts
 *
 * Original abi file:
 * - node_modules/@axelar-network/interchain-token-service/artifacts/contracts/interchain-token/ERC20Permit.sol/ERC20Permit.json
 *
 * DO NOT EDIT MANUALLY
 */

import { encodeFunctionData } from "viem";

import type { PublicContractClient } from "../../PublicContractClient";
import ABI_FILE from "./ERC20Permit.abi";

export type ERC20PermitAllowanceArgs = {
  owner: `0x${string}`;
  spender: `0x${string}`;
};

/**
 * Factory function for ERC20Permit.allowance function args
 */
export const encodeERC20PermitAllowanceArgs = ({
  owner,
  spender,
}: ERC20PermitAllowanceArgs) => [owner, spender] as const;

/**
 * Encoder function for ERC20Permit.allowance function data
 */
export const encodeERC20PermitAllowanceData = ({
  owner,
  spender,
}: ERC20PermitAllowanceArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "allowance",
    abi: ABI_FILE.abi,
    args: [owner, spender],
  });

export type ERC20PermitApproveArgs = { spender: `0x${string}`; amount: bigint };

/**
 * Factory function for ERC20Permit.approve function args
 */
export const encodeERC20PermitApproveArgs = ({
  spender,
  amount,
}: ERC20PermitApproveArgs) => [spender, amount] as const;

/**
 * Encoder function for ERC20Permit.approve function data
 */
export const encodeERC20PermitApproveData = ({
  spender,
  amount,
}: ERC20PermitApproveArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "approve",
    abi: ABI_FILE.abi,
    args: [spender, amount],
  });

export type ERC20PermitBalanceOfArgs = { balanceOfArg0: `0x${string}` };

/**
 * Factory function for ERC20Permit.balanceOf function args
 */
export const encodeERC20PermitBalanceOfArgs = ({
  balanceOfArg0,
}: ERC20PermitBalanceOfArgs) => [balanceOfArg0] as const;

/**
 * Encoder function for ERC20Permit.balanceOf function data
 */
export const encodeERC20PermitBalanceOfData = ({
  balanceOfArg0,
}: ERC20PermitBalanceOfArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "balanceOf",
    abi: ABI_FILE.abi,
    args: [balanceOfArg0],
  });

export type ERC20PermitDecreaseAllowanceArgs = {
  spender: `0x${string}`;
  subtractedValue: bigint;
};

/**
 * Factory function for ERC20Permit.decreaseAllowance function args
 */
export const encodeERC20PermitDecreaseAllowanceArgs = ({
  spender,
  subtractedValue,
}: ERC20PermitDecreaseAllowanceArgs) => [spender, subtractedValue] as const;

/**
 * Encoder function for ERC20Permit.decreaseAllowance function data
 */
export const encodeERC20PermitDecreaseAllowanceData = ({
  spender,
  subtractedValue,
}: ERC20PermitDecreaseAllowanceArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "decreaseAllowance",
    abi: ABI_FILE.abi,
    args: [spender, subtractedValue],
  });

export type ERC20PermitIncreaseAllowanceArgs = {
  spender: `0x${string}`;
  addedValue: bigint;
};

/**
 * Factory function for ERC20Permit.increaseAllowance function args
 */
export const encodeERC20PermitIncreaseAllowanceArgs = ({
  spender,
  addedValue,
}: ERC20PermitIncreaseAllowanceArgs) => [spender, addedValue] as const;

/**
 * Encoder function for ERC20Permit.increaseAllowance function data
 */
export const encodeERC20PermitIncreaseAllowanceData = ({
  spender,
  addedValue,
}: ERC20PermitIncreaseAllowanceArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "increaseAllowance",
    abi: ABI_FILE.abi,
    args: [spender, addedValue],
  });

export type ERC20PermitNoncesArgs = { noncesArg0: `0x${string}` };

/**
 * Factory function for ERC20Permit.nonces function args
 */
export const encodeERC20PermitNoncesArgs = ({
  noncesArg0,
}: ERC20PermitNoncesArgs) => [noncesArg0] as const;

/**
 * Encoder function for ERC20Permit.nonces function data
 */
export const encodeERC20PermitNoncesData = ({
  noncesArg0,
}: ERC20PermitNoncesArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "nonces",
    abi: ABI_FILE.abi,
    args: [noncesArg0],
  });

export type ERC20PermitPermitArgs = {
  issuer: `0x${string}`;
  spender: `0x${string}`;
  value: bigint;
  deadline: bigint;
  v: number;
  r: `0x${string}`;
  s: `0x${string}`;
};

/**
 * Factory function for ERC20Permit.permit function args
 */
export const encodeERC20PermitPermitArgs = ({
  issuer,
  spender,
  value,
  deadline,
  v,
  r,
  s,
}: ERC20PermitPermitArgs) =>
  [issuer, spender, value, deadline, v, r, s] as const;

/**
 * Encoder function for ERC20Permit.permit function data
 */
export const encodeERC20PermitPermitData = ({
  issuer,
  spender,
  value,
  deadline,
  v,
  r,
  s,
}: ERC20PermitPermitArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "permit",
    abi: ABI_FILE.abi,
    args: [issuer, spender, value, deadline, v, r, s],
  });

export type ERC20PermitTransferArgs = {
  recipient: `0x${string}`;
  amount: bigint;
};

/**
 * Factory function for ERC20Permit.transfer function args
 */
export const encodeERC20PermitTransferArgs = ({
  recipient,
  amount,
}: ERC20PermitTransferArgs) => [recipient, amount] as const;

/**
 * Encoder function for ERC20Permit.transfer function data
 */
export const encodeERC20PermitTransferData = ({
  recipient,
  amount,
}: ERC20PermitTransferArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "transfer",
    abi: ABI_FILE.abi,
    args: [recipient, amount],
  });

export type ERC20PermitTransferFromArgs = {
  sender: `0x${string}`;
  recipient: `0x${string}`;
  amount: bigint;
};

/**
 * Factory function for ERC20Permit.transferFrom function args
 */
export const encodeERC20PermitTransferFromArgs = ({
  sender,
  recipient,
  amount,
}: ERC20PermitTransferFromArgs) => [sender, recipient, amount] as const;

/**
 * Encoder function for ERC20Permit.transferFrom function data
 */
export const encodeERC20PermitTransferFromData = ({
  sender,
  recipient,
  amount,
}: ERC20PermitTransferFromArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "transferFrom",
    abi: ABI_FILE.abi,
    args: [sender, recipient, amount],
  });

export const ERC20_PERMIT_ENCODERS = {
  allowance: {
    args: encodeERC20PermitAllowanceArgs,
    data: encodeERC20PermitAllowanceData,
  },
  approve: {
    args: encodeERC20PermitApproveArgs,
    data: encodeERC20PermitApproveData,
  },
  balanceOf: {
    args: encodeERC20PermitBalanceOfArgs,
    data: encodeERC20PermitBalanceOfData,
  },
  decreaseAllowance: {
    args: encodeERC20PermitDecreaseAllowanceArgs,
    data: encodeERC20PermitDecreaseAllowanceData,
  },
  increaseAllowance: {
    args: encodeERC20PermitIncreaseAllowanceArgs,
    data: encodeERC20PermitIncreaseAllowanceData,
  },
  nonces: {
    args: encodeERC20PermitNoncesArgs,
    data: encodeERC20PermitNoncesData,
  },
  permit: {
    args: encodeERC20PermitPermitArgs,
    data: encodeERC20PermitPermitData,
  },
  transfer: {
    args: encodeERC20PermitTransferArgs,
    data: encodeERC20PermitTransferData,
  },
  transferFrom: {
    args: encodeERC20PermitTransferFromArgs,
    data: encodeERC20PermitTransferFromData,
  },
};

export function createERC20PermitReadClient(
  publicClient: PublicContractClient<typeof ABI_FILE.abi>,
) {
  return {
    DOMAIN_SEPARATOR() {
      return publicClient.read("DOMAIN_SEPARATOR");
    },
    allowance(allowanceArgs: ERC20PermitAllowanceArgs) {
      const encoder = ERC20_PERMIT_ENCODERS["allowance"];
      const encodedArgs = encoder.args(allowanceArgs);

      return publicClient.read("allowance", { args: encodedArgs });
    },
    balanceOf(balanceOfArgs: ERC20PermitBalanceOfArgs) {
      const encoder = ERC20_PERMIT_ENCODERS["balanceOf"];
      const encodedArgs = encoder.args(balanceOfArgs);

      return publicClient.read("balanceOf", { args: encodedArgs });
    },
    nameHash() {
      return publicClient.read("nameHash");
    },
    nonces(noncesArgs: ERC20PermitNoncesArgs) {
      const encoder = ERC20_PERMIT_ENCODERS["nonces"];
      const encodedArgs = encoder.args(noncesArgs);

      return publicClient.read("nonces", { args: encodedArgs });
    },
    totalSupply() {
      return publicClient.read("totalSupply");
    },
  };
}
