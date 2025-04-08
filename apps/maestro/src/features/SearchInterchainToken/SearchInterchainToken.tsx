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
import { isValidSuiTokenAddress } from "~/lib/utils/validation";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useERC20TokenDetailsQuery } from "~/services/erc20";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
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

  const chainId = connectedChain?.id ?? selectedChainId;
  const chainName = connectedChain?.name ?? defaultChain?.name;

  const {
    data: searchERC20Result,
    error: searchERC20Error,
    isLoading: isSearchingERC20,
  } = useERC20TokenDetailsQuery({
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
    (!isValidEVMAddress && !isValidSuiAddress && search.length >= 10);

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
              ? `Search for ERC-20 token address on ${chainName}`
              : "Search for ERC-20 token address"
          }
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="join-item flex-1 bg-base-200 text-sm focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="btn join-item bg-base-300">
          {isLoading && isAddress(search) ? (
            <SpinnerIcon className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <ChainsDropdown
              triggerClassName="btn btn-sm btn-circle"
              contentClassName="translate-x-4 translate-y-2 sm:w-96 md:w-[448px]"
              compact
              hideLabel
              renderTrigger={() => (
                <Dropdown.Trigger
                  $as="button"
                  role="button"
                  aria-label="Select Chain"
                  tabIndex={-1}
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
            "Invalid ERC-20 token address"}
        </div>
      )}
    </FormControl>
  );
};

export default SearchInterchainToken;
