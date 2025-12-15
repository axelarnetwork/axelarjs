import { createUseReadContract, createUseWriteContract } from "wagmi/codegen";

export const hederaTokenServicePrecompileAddress =
  "0x0000000000000000000000000000000000000167" as const;

export const hederaTokenServicePrecompileAbi = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "token", type: "address" },
    ],
    name: "associateToken",
    outputs: [{ internalType: "int64", name: "responseCode", type: "int64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "token", type: "address" },
    ],
    name: "dissociateToken",
    outputs: [{ internalType: "int64", name: "responseCode", type: "int64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const hederaTokenServicePrecompileConfig = {
  address: hederaTokenServicePrecompileAddress,
  abi: hederaTokenServicePrecompileAbi,
} as const;

export const useReadHederaTokenServicePrecompile =
  /*#__PURE__*/ createUseReadContract({
    abi: hederaTokenServicePrecompileAbi,
    address: hederaTokenServicePrecompileAddress,
  });

export const useWriteHederaTokenAssociation =
  /*#__PURE__*/ createUseWriteContract({
    abi: hederaTokenServicePrecompileAbi,
    address: hederaTokenServicePrecompileAddress,
    functionName: "associateToken",
  });

export const useWriteHederaTokenDissociation =
  /*#__PURE__*/ createUseWriteContract({
    abi: hederaTokenServicePrecompileAbi,
    address: hederaTokenServicePrecompileAddress,
    functionName: "dissociateToken",
  });
