import {
  ClaimOwnershipFormFieldIds,
  NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK,
} from "~/config/env";

const chainIdToGFormChainId = {
  arbitrum: "Arbitrum",
  base: "Base",
  binance: "Binance Smart Chain(BSC)",
  celo: "Celo",
  ethereum: "Ethereum",
  fantom: "Fantom",
  linea: "Linea",
  moonbeam: "Moonbeam",
  optimism: "Optimism",
  polygon: "Polygon",
  scroll: "Scroll",
} as any;

export function getPrefilledClaimOwnershipFormLink(
  sourceChain: string,
  allChains: string[],
  tokenType: string,
  tokenAddress: string
) {
  const formLink = NEXT_PUBLIC_CLAIM_OWNERSHIP_FORM_LINK;
  const formFields = {
    [ClaimOwnershipFormFieldIds.sourceChain]: sourceChain,
    [ClaimOwnershipFormFieldIds.tokenType]: tokenType,
    [ClaimOwnershipFormFieldIds.tokenAddress]: tokenAddress,
  };

  const destChainsParams: string[] = allChains
    .filter((chain) => chainIdToGFormChainId[chain])
    .map(
      (chain) =>
        `${ClaimOwnershipFormFieldIds.allChains}=${chainIdToGFormChainId[chain]}`
    );

  const queryParams = new URLSearchParams(formFields).toString();

  return `${formLink}?${queryParams}&${destChainsParams.join("&")}`;
}