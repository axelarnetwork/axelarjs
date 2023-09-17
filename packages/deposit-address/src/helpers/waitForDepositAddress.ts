import { LinkRequestResponse } from "@axelarjs/api";
import { createAxelarscanNodeClient } from "@axelarjs/api/axelarscan/node";

export type ListenerParams = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  module: string;
};

const isStrEqual = (a: string | undefined, b: string) =>
  a?.toLowerCase() === b?.toLowerCase();

const findLinkRequest = (
  params: ListenerParams,
  results: LinkRequestResponse[]
) => {
  const foundEntry = results.find(
    (linkRequest) =>
      params.module === "axelarnet" ||
      (isStrEqual(linkRequest.sourceChain, params.sourceChain) &&
        isStrEqual(linkRequest.destinationAddress, params.destinationAddress) &&
        isStrEqual(linkRequest.destinationChain, params.destinationChain) &&
        isStrEqual(linkRequest.asset, params.asset))
  );
  return foundEntry;
};

export async function waitForDepositAddress(params: ListenerParams) {
  const apiClient = createAxelarscanNodeClient({
    prefixUrl: "https://testnet.api.axelarscan.io",
  });

  return await poll(
    params,
    () => apiClient.getRecentLinkTransactions({ size: 10 }),
    (res: LinkRequestResponse[]) => !findLinkRequest(params, res),
    5_000,
    5
  );
}

async function poll(
  params: ListenerParams,
  fn: any,
  keepGoingCondition: any,
  ms: number,
  maxTries: number
) {
  let tries = 0;
  let results = await fn();

  while (keepGoingCondition(results) && tries < maxTries) {
    await sleep(ms);
    results = await fn();
    tries++;
  }
  const depositAddress = findLinkRequest(params, results);
  return depositAddress ? Promise.resolve(depositAddress) : Promise.reject("");
}

async function sleep(ms = 1000) {
  return new Promise((res) => setTimeout(res, ms));
}
