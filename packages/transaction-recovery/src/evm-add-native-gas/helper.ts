import { AxelarConfigClient, AxelarEVMChainConfig } from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

import { parseAbi, parseEventLogs, type TransactionReceipt } from "viem";

export function isContractCallWithToken(receipt: TransactionReceipt): boolean {
  return !!getContractCallWithTokenEvent(receipt);
}

export function getContractCallEvent(receipt: TransactionReceipt) {
  return parseEventLogs({
    abi: parseAbi([
      "event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)",
    ]),
    logs: receipt.logs,
  })[0];
}

export function getContractCallWithTokenEvent(receipt: TransactionReceipt) {
  const logs = parseEventLogs({
    abi: parseAbi([
      "event ContractCallWithToken(address indexed sender, string destinationChain, string destinationContractAddress, bytes32 indexed payloadHash, bytes payload, string symbol, uint256 amount)",
    ]),
    logs: receipt.logs,
  });

  return logs[0];
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

  return logs[0];
}

// export function findContractEvent<
//   TSignature extends `0x${string}`,
//   TAbi extends Abi
// >(
//   receipt: TransactionReceipt,
//   eventSignatures: TSignature[],
//   eventName: string,
//   abi: TAbi
// ) {
//   // const logs = parseEventLogs({
//   //   abi,
//   //   logs: receipt.logs,

//   // });
//   // logs.forEach((log) => {
//   //   log.args?
//   // })
//   for (const [index, log] of receipt.logs.entries()) {
//     // const _log = log a
//     const eventTopic = log.topics[0].slice(0, 10);
//     if (!eventTopic) continue;

//     const eventIndex = eventSignatures.indexOf(eventTopic);
//     if (eventIndex > -1) {
//       const eventLog = decodeEventLog({
//         abi,
//         data: log.data,
//         topics: log.topics,
//       });

//       return {
//         signature: eventSignatures[eventIndex],
//         eventLog,
//         logIndex: log.logIndex,
//         eventIndex: index,
//       };
//     }
//   }
// }

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

  return logs[0];
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
): string {
  const typeContractCallWithToken = isContractCallWithToken(receipt);
  if (typeContractCallWithToken) {
    const gasReceiverEvent =
      getNativeGasPaidForContractCallWithTokenEvent(receipt);
    const gatewayEvent = getContractCallWithTokenEvent(receipt);

    if (gasReceiverEvent && gatewayEvent) {
      return gasReceiverEvent.args.gasFeeAmount.toString();
    } else {
      return "0";
    }
  } else {
    const gasReceiverEvent = getNativeGasPaidForContractCallEvent(receipt);
    const gatewayEvent = getContractCallEvent(receipt);

    if (gasReceiverEvent && gatewayEvent) {
      return gasReceiverEvent.args.gasFeeAmount.toString();
    } else {
      return "0";
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

  return logs[0].args.destinationChain;
}

export async function getGasServiceAddressFromChainConfig(
  chainConfig: AxelarConfigClient,
  env: Environment,
  chain: string
) {
  const _chainConfigs = await chainConfig.getChainConfigs(env);
  const mapEvmChains = Object.entries(_chainConfigs.chains)
    .filter(([, v]) => {
      return v.module === "evm";
    })
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});

  const srcChainConfig = mapEvmChains[
    chain.toLowerCase()
  ] as AxelarEVMChainConfig;

  return srcChainConfig.evmConfigs.contracts.gasService;
}
