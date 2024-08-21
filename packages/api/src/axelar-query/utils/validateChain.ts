import type { Environment } from "@axelarjs/cosmos";

import { stringSimilarity } from "string-similarity-js";

import { loadChains } from "../chains";

export async function validateChainIdentifier(
  chainIdentifier: string,
  environment: Environment
) {
  const chains = await loadChains({
    environment,
  });
  const chainIdentifiers = chains.map(
    (chain) => chain.chainIdentifier[environment]
  );

  const foundChain = chainIdentifiers.find(
    (identifier: string) => identifier === chainIdentifier.toLowerCase()
  );

  return {
    foundChain: !!foundChain,
    bestMatch: foundChain
      ? false
      : findSimilarInArray(chainIdentifiers, chainIdentifier),
  };
}

function findSimilarInArray(array: Array<string>, wordsToFind: string) {
  let bestMatch = array[0];
  let bestScore = 0;

  array.forEach((item) => {
    const score = stringSimilarity(item, wordsToFind);
    if (score >= bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  });
  return bestMatch;
}

export async function throwIfInvalidChainIds(
  chains: string[],
  environment: Environment
) {
  const validations = await Promise.all(
    chains.map((chain) => validateChainIdentifier(chain, environment))
  );

  for (let i = 0; i < validations.length; i++) {
    if (!validations[i]?.foundChain) {
      throw new Error(
        `Invalid chain identifier for ${chains[i]}. Did you mean ${validations[i]?.bestMatch}?`
      );
    }
  }
}
