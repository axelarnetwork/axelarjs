import {
  ClaimOwnershipFormFieldIds,
  NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK,
} from "~/config/env";

const chainIdToGFormChainId = {
  arbitrum: "Arbitrum",
  base: "Base",
  binance: "BNB Chain",
  celo: "Celo",
  ethereum: "Ethereum",
  fantom: "Fantom",
  linea: "Linea",
  moonbeam: "Moonbeam",
  optimism: "Optimism",
  polygon: "Polygon",
  scroll: "Scroll",
  blast: "Blast",
  fraxtal: "Fraxtal",
  avalanche: "Avalanche",
  kava: "Kava",
  filecoin: "Filecoin",
  mantle: "Mantle",
} as any;

export function getPrefilledClaimOwnershipFormLink(
  sourceChain: string,
  allChains: string[],
  tokenType: string,
  tokenAddress: string,
  tokenName: string,
  tokenSymbol: string
) {
  const srcChain = sourceChain.toLowerCase();
  const formLink = NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK;
  const formFields = {
    [ClaimOwnershipFormFieldIds.sourceChain]: chainIdToGFormChainId[srcChain],
    [ClaimOwnershipFormFieldIds.tokenType]: tokenType,
    [ClaimOwnershipFormFieldIds.tokenAddress]: tokenAddress,
    [ClaimOwnershipFormFieldIds.tokenName]: `${tokenName} (${tokenSymbol})`,
  };

  const destChainsParams: string[] = allChains
    .filter((chain) => chainIdToGFormChainId[chain] && chain !== srcChain)
    .map(
      (chain) =>
        `${ClaimOwnershipFormFieldIds.allChains}=${chainIdToGFormChainId[chain]}`
    );

  const queryParams = new URLSearchParams(formFields).toString();

  return `${formLink}?${queryParams}&${destChainsParams.join("&")}`;
}
