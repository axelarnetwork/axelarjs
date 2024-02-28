import {
  decodeEventLog,
  parseAbi,
  toFunctionSelector,
  type Abi,
  type DecodeEventLogReturnType,
  type TransactionReceipt,
} from "viem";

import { EvmAddNativeGasParams } from "../types";

export function isContractCallWithToken(receipt: TransactionReceipt): boolean {
  return !!getContractCallWithTokenEvent(receipt);
}

export function getContractCallEvent(receipt: TransactionReceipt) {
  const signatureContractCall = toFunctionSelector(
    "ContractCall(address,string,string,bytes32,bytes)"
  );
  return findContractEvent(
    receipt,
    signatureContractCall,
    parseAbi([
      "event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)",
    ])
  );
}

export function getContractCallWithTokenEvent(receipt: TransactionReceipt) {
  const signatureContractCallWithToken = toFunctionSelector(
    "ContractCallWithToken(address,string,string,bytes32,bytes,string,uint256)"
  );
  return findContractEvent(
    receipt,
    signatureContractCallWithToken,
    parseAbi([
      "event ContractCallWithToken(address indexed sender, string destinationChain, string destinationContractAddress, bytes32 indexed payloadHash, bytes payload, string symbol, uint256 amount)",
    ])
  );
}

export function getNativeGasPaidForContractCallEvent(
  receipt: TransactionReceipt
) {
  const signatureGasPaidContractCall = toFunctionSelector(
    "NativeGasPaidForContractCall(address,string,string,bytes32,uint256,address)"
  );

  const abi: Abi = parseAbi([
    "event NativeGasPaidForContractCall(address indexed sourceAddress,string destinationChain,string destinationAddress,bytes32 indexed payloadHash,uint256 gasFeeAmount,address refundAddress)",
  ]);

  return findContractEvent(receipt, signatureGasPaidContractCall, abi);
}

export function findContractEvent<TSignature extends `0x${string}`>(
  receipt: TransactionReceipt,
  eventSignatures: TSignature,
  abi: Abi
) {
  for (const [index, log] of receipt.logs.entries()) {
    const topic0 = log.topics[0];
    if (!topic0) continue;

    const eventIndex = eventSignatures.indexOf(topic0);
    if (eventIndex > -1) {
      const eventLog = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
      });

      return {
        signature: eventSignatures[eventIndex],
        eventLog,
        logIndex: log.logIndex,
        eventIndex: index,
      };
    }
  }
}

export function getNativeGasPaidForContractCallWithTokenEvent(
  receipt: TransactionReceipt
) {
  const signatureGasPaidContractCallWithToken = toFunctionSelector(
    "NativeGasPaidForContractCallWithToken(address,string,string,bytes32,string,uint256,uint256,address)"
  );
  return findContractEvent(
    receipt,
    signatureGasPaidContractCallWithToken,
    parseAbi([
      "event NativeGasPaidForContractCallWithToken(address indexed sourceAddress,string destinationChain,string destinationAddress,bytes32 indexed payloadHash,string symbol,uint256 amount,uint256 gasFeeAmount,address refundAddress)",
    ])
  );
}

export function validateContractCallWithToken(
  gatewayEvent: DecodeEventLogReturnType,
  gasReceiverEvent: DecodeEventLogReturnType
) {
  console.log(gatewayEvent.args);
  console.log(gasReceiverEvent.args);
  return true;
  // return (
  //   gatewayEvent.args.sender === gasReceiverEvent.eventLog.args.sourceAddress &&
  //   gatewayEvent.eventLog.args.destinationChain ===
  //     gasReceiverEvent.eventLog.args.destinationChain &&
  //   gatewayEvent.eventLog.args.destinationContractAddress ===
  //     gasReceiverEvent.eventLog.args.destinationAddress &&
  //   gatewayEvent.eventLog.args.payloadHash === gasReceiverEvent.eventLog.args.payloadHash &&
  //   gatewayEvent.eventLog.args.symbol === gasReceiverEvent.eventLog.args.symbol &&
  //   gatewayEvent.eventLog.args.amount.toString() ===
  //     gasReceiverEvent.eventLog.args.amount.toString()
  // );
}

export function validateContractCall(
  gatewayEvent: DecodeEventLogReturnType,
  gasReceiverEvent: DecodeEventLogReturnType
) {
  // TODO: implement
  return true;
}

export function getNativeGasAmountFromTxReceipt(
  receipt: TransactionReceipt
): string {
  const typeContractCallWithToken = isContractCallWithToken(receipt);
  let gasReceiverEvent, gatewayEvent;
  if (typeContractCallWithToken) {
    gasReceiverEvent = getNativeGasPaidForContractCallWithTokenEvent(receipt);
    gatewayEvent = getContractCallWithTokenEvent(receipt);

    if (
      gasReceiverEvent &&
      gatewayEvent &&
      validateContractCallWithToken(gatewayEvent, gasReceiverEvent)
    ) {
      return gasReceiverEvent?.eventLog.args.gasFeeAmount.toString();
    } else {
      return "0";
    }
  } else {
    gasReceiverEvent = getNativeGasPaidForContractCallEvent(receipt);
    gatewayEvent = getContractCallEvent(receipt);

    if (
      gasReceiverEvent &&
      gatewayEvent &&
      validateContractCall(gatewayEvent, gasReceiverEvent)
    ) {
      return gasReceiverEvent?.eventLog.args.gasFeeAmount.toString();
    } else {
      return "0";
    }
  }
}
