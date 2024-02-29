import { parseAbi, parseEventLogs, type TransactionReceipt } from "viem";

export function isContractCallWithToken(receipt: TransactionReceipt): boolean {
  return !!getContractCallWithTokenEvent(receipt);
}

export function getContractCallEvent(receipt: TransactionReceipt) {
  const logs = parseEventLogs({
    abi: parseAbi([
      "event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)",
    ]),
    logs: receipt.logs,
  });

  return logs?.[0];
}

export function getContractCallWithTokenEvent(receipt: TransactionReceipt) {
  const logs = parseEventLogs({
    abi: parseAbi([
      "event ContractCallWithToken(address indexed sender, string destinationChain, string destinationContractAddress, bytes32 indexed payloadHash, bytes payload, string symbol, uint256 amount)",
    ]),
    logs: receipt.logs,
  });

  return logs?.[0];
}

export function getNativeGasPaidForContractCallEvent(
  receipt: TransactionReceipt
) {
  const abi = parseAbi([
    "event NativeGasPaidForContractCall(address indexed sourceAddress,string destinationChain,string destinationAddress,bytes32 indexed payloadHash,uint256 gasFeeAmount,address refundAddress)",
  ] as const);

  const logs = parseEventLogs({
    abi,
    logs: receipt.logs,
    eventName: "NativeGasPaidForContractCall",
  });

  return logs?.[0];
}

export function getNativeGasPaidForContractCallWithTokenEvent(
  receipt: TransactionReceipt
) {
  const abi = parseAbi([
    "event NativeGasPaidForContractCallWithToken(address indexed sourceAddress,string destinationChain,string destinationAddress,bytes32 indexed payloadHash,string symbol,uint256 amount,uint256 gasFeeAmount,address refundAddress)",
  ]);

  const logs = parseEventLogs({
    abi,
    logs: receipt.logs,
    eventName: "NativeGasPaidForContractCallWithToken",
  });

  return logs?.[0];
}

export function getLogIndexFromTxReceipt(receipt: TransactionReceipt): number {
  const contractCallEvent = getContractCallEvent(receipt);
  const contractCallWithTokenEvent = getContractCallWithTokenEvent(receipt);

  if (contractCallEvent) {
    return contractCallEvent.logIndex;
  }

  if (contractCallWithTokenEvent) {
    return contractCallWithTokenEvent.logIndex;
  }

  throw new Error("Log index not found");
}

export function getNativeGasAmountFromTxReceipt(
  receipt: TransactionReceipt
): bigint {
  const typeContractCallWithToken = isContractCallWithToken(receipt);
  if (typeContractCallWithToken) {
    const gasReceiverEvent =
      getNativeGasPaidForContractCallWithTokenEvent(receipt);
    const gatewayEvent = getContractCallWithTokenEvent(receipt);

    if (gasReceiverEvent && gatewayEvent) {
      return gasReceiverEvent.args.gasFeeAmount;
    } else {
      return 0n;
    }
  } else {
    const gasReceiverEvent = getNativeGasPaidForContractCallEvent(receipt);
    const gatewayEvent = getContractCallEvent(receipt);

    if (gasReceiverEvent && gatewayEvent) {
      return gasReceiverEvent.args.gasFeeAmount;
    } else {
      return 0n;
    }
  }
}

export function getDestinationChainFromTxReceipt(receipt: TransactionReceipt) {
  const logs = parseEventLogs({
    abi: parseAbi([
      "event ContractCallWithToken(address indexed sender, string destinationChain, string destinationContractAddress, bytes32 indexed payloadHash, bytes payload, string symbol, uint256 amount)",
      "event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)",
    ]),
    logs: receipt.logs,
  });

  return logs?.[0]?.args?.destinationChain;
}

export function extractReceiptInfoForNativeGasPaid(
  receipt: TransactionReceipt
): {
  paidFee: bigint;
  destChain: string;
  logIndex: number;
} {
  const paidFee = getNativeGasAmountFromTxReceipt(receipt);
  const destChain = getDestinationChainFromTxReceipt(receipt);
  const logIndex = getLogIndexFromTxReceipt(receipt);

  return {
    paidFee,
    destChain,
    logIndex,
  };
}
