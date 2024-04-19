import { cn, FormControl, SpinnerIcon, TextInput, Tooltip } from "@axelarjs/ui";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, useState, type ChangeEvent, type FC } from "react";

import { isAddress } from "viem";
import { useAccount } from "wagmi";

import useQueryStringState from "~/lib/hooks/useQueryStringStyate";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useERC20TokenDetailsQuery } from "~/services/erc20";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";

export type TokenFoundResult = {
  tokenId?: `0x${string}`;
  tokenAddress: `0x${string}`;
  chainName?: string;
};

export type SearchInterchainTokenProps = {
  onTokenFound: (result: TokenFoundResult) => void;
};

const SearchInterchainToken: FC<SearchInterchainTokenProps> = (props) => {
  const [search, setSearch] = useQueryStringState<string>("search", "");

  const { chain: connectedChain } = useAccount();

  const { computed } = useEVMChainConfigsQuery();

  const [selectedChainId, setSelectedChainId] = useSessionStorageState(
    "@maestro/SearchInterchainToken.selectedChainId",
    connectedChain?.id ?? -1
  );
  const defaultChain = useMemo(
    () => computed.indexedByChainId[selectedChainId],
    [computed.indexedByChainId, selectedChainId]
  );

  const isValidAddress = isAddress(search as `0x${string}`);

  const chainId = connectedChain?.id ?? selectedChainId;
  const chainName = connectedChain?.name ?? defaultChain?.name;

  const {
    data: searchERC20Result,
    error: searchERC20Error,
    isLoading: isSearchingERC20,
  } = useERC20TokenDetailsQuery({
    chainId: chainId,
    tokenAddress: search as `0x${string}`,
  });

  const {
    data: searchInterchainTokenResult,
    error: searchInterchainTokenError,
    isLoading: isSearchingInterchainTokens,
  } = useInterchainTokensQuery({
    chainId,
    tokenAddress: search as `0x${string}`,
    strict: chainId !== -1,
  });

  const isLoading = isSearchingERC20 || isSearchingInterchainTokens;

  const hasError =
    Boolean(searchERC20Error || searchInterchainTokenError) && !isLoading;

  useEffect(() => {
    if (
      (searchInterchainTokenResult?.tokenId &&
        searchInterchainTokenResult.tokenAddress) ||
      searchERC20Result
    ) {
      props.onTokenFound({
        tokenId: searchInterchainTokenResult.tokenId as `0x${string}`,
        tokenAddress: search as `0x${string}`,
        chainName: searchERC20Result?.axelarChainName,
      });
    }
  }, [
    searchInterchainTokenResult.tokenAddress,
    searchInterchainTokenResult.tokenId,
    props,
    search,
    searchERC20Result,
  ]);

  const [isFocused, setIsFocused] = useState(false);

  const shouldRenderError =
    (hasError && !searchERC20Result) ||
    (!isValidAddress && search.length >= 10);

  return (
    <FormControl className="relative w-full max-w-xs md:max-w-md">
      <div className="pb-2 text-center">Take your token interchain</div>
      <div
        className={cn("join rounded-md transition-transform", {
          "ring-error ring-offset-base-200 ring-1 ring-offset-2":
            shouldRenderError,
          "ring-offset-base-200 ring-1 ring-offset-2": isFocused,
        })}
      >
        <TextInput
          type="search"
          name="tokenAddress"
          placeholder={
            defaultChain?.name
              ? `Search for ERC-20 token address on ${chainName}`
              : "Search for ERC-20 token address"
          }
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="bg-base-200 join-item flex-1 focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="btn join-item bg-base-300">
          {isLoading && isAddress(search) ? (
            <SpinnerIcon className="text-primary h-6 w-6 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-white">
                Selected Chain
              </span>
              <Tooltip
                tip={`search on ${chainName ?? "all chains"}`}
                className="tooltip-left md:tooltip-top"
              >
                <EVMChainsDropdown
                  triggerClassName="btn btn-sm btn-circle"
                  contentClassName="translate-x-4 translate-y-2 sm:w-96 md:w-[448px]"
                  compact
                  hideLabel
                  selectedChain={defaultChain}
                  onSelectChain={
                    !connectedChain
                      ? (chain) =>
                          chain
                            ? setSelectedChainId(chain.chain_id)
                            : setSelectedChainId(-1)
                      : undefined
                  }
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      {shouldRenderError && (
        <div
          role="alert"
          className="text-error -bottom-5 mx-auto w-full flex-1 p-2 text-center text-sm"
        >
          {(searchInterchainTokenError ?? searchERC20Error)?.message ??
            "Invalid ERC-20 token address"}
        </div>
      )}
    </FormControl>
  );
};

export default SearchInterchainToken;
