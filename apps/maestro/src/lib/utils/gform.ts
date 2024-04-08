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
    [`entry.${ClaimOwnershipFormFieldIds.sourceChain}`]: sourceChain,
    [`entry.${ClaimOwnershipFormFieldIds.tokenType}`]: tokenType,
    [`entry.${ClaimOwnershipFormFieldIds.tokenAddress}`]: tokenAddress,
  };

  allChains.forEach((chain) => {
    const chainId = chainIdToGFormChainId[chain];
    if (chainId) {
      formFields[`entry.${ClaimOwnershipFormFieldIds.allChains}`] = chainId;
    }
  });

  const queryParams = new URLSearchParams(formFields).toString();

  return `${formLink}?${queryParams}`;
}
