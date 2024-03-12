import { BaseChainConfig, EVMChainConfig } from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

import { TransactionReceipt } from "viem";
import { a } from "vitest/dist/suite-UrZdHRff";

async function findEventAndConfirmIfNeeded(
  srcChain: string,
  destChain: string,
  txHash: string,
  txEventIndex: number | undefined
) {}

async function getEvmEvent(
  srcChain: string,
  destChain: string,
  txHash: string,
  txEventIndex: number | undefined
) {}

async function getEventIndex(chain: string, txHash: string) {}

async function getEventIndexFromTxReceipt(receipt: TransactionReceipt) {}

async function routeMessageRequest(
  txHash: string,
  payload: string,
  eventIndex: number
) {}

async function getCidFromSrcTxHash();

async function getCommandId(
  chainName: string,
  txHash: string,
  sourceEventIndex: number,
  environment: Environment
) {
  // const chainID: number = rpcInfo[environment].networkInfo[chainName.toLowerCase()]?.chainId;
  // if (!chainID) return "";
  // const seiArr = arrayify(sourceEventIndex).reverse();
  // const txHashWithEventIndex = new Uint8Array([
  //   ...arrayify(txHash),
  //   ...new Uint8Array(8).map((a, i) => seiArr[i] || a),
  // ]);
  // const chainIdByteArray = arrayify(chainID);
  // const dataToHash = new Uint8Array(txHashWithEventIndex.length + chainIdByteArray.length);
  // dataToHash.set(txHashWithEventIndex, 0);
  // dataToHash.set(chainIdByteArray, txHashWithEventIndex.length);
  // return keccak256(dataToHash).slice(2); // remove 0x prefix
}

async function getConfirmationHeight(chain: string) {}

async function doesTxMeetConfirmHt(chain: string, txHash: `0x${string}`) {}
