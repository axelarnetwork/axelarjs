import {
  cn,
  Dropdown,
  FormControl,
  SpinnerIcon,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, useState, type ChangeEvent, type FC } from "react";

import { isAddress } from "viem";

import { useAccount } from "~/lib/hooks";
import useQueryStringState from "~/lib/hooks/useQueryStringStyate";
import {
  isValidStellarTokenAddress,
  isValidSuiTokenAddress,
} from "~/lib/utils/validation";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useNativeTokenDetailsQuery } from "~/services/nativeTokens/hooks";
import ChainsDropdown, {
  ChainIconComponent,
} from "~/ui/components/ChainsDropdown";

export type TokenFoundResult = {
  tokenId?: `0x${string}`;
  tokenAddress: string;
  chainName?: string;
};

export type SearchInterchainTokenProps = {
  onTokenFound: (result: TokenFoundResult) => void;
};

const SearchInterchainToken: FC<SearchInterchainTokenProps> = (props) => {
  const [search, setSearch] = useQueryStringState<string>("search", "");

  const { chain: connectedChain } = useAccount();

  const { combinedComputed } = useAllChainConfigsQuery();

  const [selectedChainId, setSelectedChainId] = useSessionStorageState(
    "@maestro/SearchInterchainToken.selectedChainId",
    connectedChain?.id ?? -1
  );

  const defaultChain = useMemo(
    () => combinedComputed.indexedByChainId[selectedChainId],
    [combinedComputed.indexedByChainId, selectedChainId]
  );

  const isValidEVMAddress = isAddress(search as `0x${string}`);
  const isValidSuiAddress = isValidSuiTokenAddress(search);
  const isValidStellar = isValidStellarTokenAddress(search);

  const chainId = connectedChain?.id ?? selectedChainId;
  const chainName = connectedChain?.name ?? defaultChain?.name;

  const {
    data: searchERC20Result,
    error: searchERC20Error,
    isLoading: isSearchingERC20,
  } = useNativeTokenDetailsQuery({
    chainId: chainId,
    tokenAddress: search,
  });

  const {
    data: searchInterchainTokenResult,
    error: searchInterchainTokenError,
    isLoading: isSearchingInterchainTokens,
  } = useInterchainTokensQuery({
    chainId,
    tokenAddress: search,
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
        tokenAddress: search,
        chainName: searchERC20Result?.axelarChainName || undefined,
      });
    }
  }, [
    searchInterchainTokenResult.tokenAddress,
    searchInterchainTokenResult.tokenId,
    searchERC20Result,
    props,
    search,
  ]);

  const [isFocused, setIsFocused] = useState(false);

  const shouldRenderError =
    (hasError && !searchERC20Result) ||
    (!isValidEVMAddress &&
      !isValidSuiAddress &&
      !isValidStellar &&
      search.length >= 10);

  return (
    <FormControl className="relative w-full max-w-xs md:max-w-md">
      <div className="pb-2 text-center font-semibold">
        TAKE YOUR TOKEN INTERCHAIN
      </div>
      <div
        className={cn("join rounded-md transition-transform", {
          "ring-1 ring-error ring-offset-2 ring-offset-base-200":
            shouldRenderError,
          "ring-1 ring-offset-2 ring-offset-base-200": isFocused,
        })}
      >
        <TextInput
          type="search"
          name="tokenAddress"
          placeholder={
            defaultChain?.name
              ? `Search for any token address on ${chainName}`
              : "Search for any token address"
          }
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="join-item flex-1 bg-base-200 text-sm focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="btn join-item relative z-10 bg-base-300 p-0">
          {isLoading && isAddress(search) ? (
            <SpinnerIcon className="h-6 w-6 animate-spin px-4 text-primary" />
          ) : (
            <ChainsDropdown
              triggerClassName="btn btn-sm btn-circle"
              contentClassName="sm:w-96 md:w-[448px]"
              containerClassName="h-full"
              compact
              hideLabel
              renderTrigger={() => (
                <Dropdown.Trigger
                  $as="button"
                  role="button"
                  aria-label="Select Chain"
                  tabIndex={-1}
                  className="h-full px-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden text-gray-700 dark:text-white md:block">
                      Selected Chain
                    </span>
                    <Tooltip
                      tip={`Search on ${chainName ?? "all chains"}`}
                      className="tooltip-left md:tooltip-top"
                    >
                      {/* if both selectedChain and onSelectedChain exist,
                        operate in controlled mode
                    */}
                      <div className="flex items-center">
                        <ChainIconComponent
                          size="md"
                          hideLabel
                          selectedChain={defaultChain}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </Dropdown.Trigger>
              )}
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
          )}
        </div>
      </div>
      {shouldRenderError && (
        <div
          role="alert"
          className="-bottom-5 mx-auto w-full flex-1 p-2 text-center text-sm text-error"
        >
          {(searchInterchainTokenError ?? searchERC20Error)?.message ??
            "Invalid token address"}
        </div>
      )}
    </FormControl>
  );
};

export default SearchInterchainToken;
