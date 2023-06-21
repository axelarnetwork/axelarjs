import {
  FormControl,
  InputGroup,
  SpinnerIcon,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect, useMemo, useState, type FC } from "react";

import clsx from "clsx";
import { isAddress } from "viem";
import { useNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useERC20TokenDetailsQuery } from "~/services/erc20";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

export type SearchInterchainTokens = {
  onTokenFound: (result: {
    tokenId?: `0x${string}`;
    tokenAddress: `0x${string}`;
    chainName?: string;
  }) => void;
};

const SearchInterchainTokens: FC<SearchInterchainTokens> = (props) => {
  const [search, setSearch] = useState<string>("");

  const { chain: connectedChain } = useNetwork();

  const { computed } = useEVMChainConfigsQuery();

  const [selectedChainId, setSelectedChainId] = useSessionStorageState(
    "@maestro/SearchInterchainTokens.selectedChainId",
    connectedChain?.id ?? 1
  );
  const defaultChain = useMemo(
    () => computed.indexedByChainId[selectedChainId],
    [computed.indexedByChainId, selectedChainId]
  );

  const isValidAddress = isAddress(search as `0x${string}`);

  const chainId = connectedChain?.id ?? selectedChainId;

  const {
    data: searchERC20Result,
    error: searchERC20Error,
    isLoading: isSearchingERC20,
  } = useERC20TokenDetailsQuery({
    chainId: chainId,
    tokenAddress: search as `0x${string}`,
  });

  const {
    data: searchInterchainTokensResult,
    error: searchInterchainTokensError,
    isLoading: isSearchingInterchainTokens,
  } = useInterchainTokensQuery({
    chainId: chainId,
    tokenAddress: search as `0x${string}`,
  });

  const isLoading = isSearchingERC20 || isSearchingInterchainTokens;

  const hasError =
    Boolean(searchERC20Error || searchInterchainTokensError) && !isLoading;

  useEffect(() => {
    if (
      (searchInterchainTokensResult?.tokenId &&
        searchInterchainTokensResult.tokenAddress) ||
      searchERC20Result
    ) {
      console.log("tokenFound", { tokenDetails: searchERC20Result });
      props.onTokenFound({
        tokenId: searchInterchainTokensResult.tokenId,
        tokenAddress: search as `0x${string}`,
        chainName: searchERC20Result?.chainName,
      });
    }
  }, [
    searchInterchainTokensResult.tokenAddress,
    searchInterchainTokensResult.tokenId,
    props,
    search,
    searchERC20Result,
  ]);

  return (
    <FormControl className="relative w-full max-w-xs md:max-w-md">
      <InputGroup
        className={clsx("rounded-md", {
          "ring-error ring-offset-base-200 rounded-lg ring-1 ring-offset-2":
            hasError,
        })}
      >
        <TextInput
          bordered={true}
          type="search"
          name="tokenAddress"
          placeholder={
            defaultChain?.name
              ? `Search for ERC-20 token address on ${defaultChain?.name}`
              : "Search for ERC-20 token address"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-base-200 flex-1"
        />
        <span>
          {isLoading && isAddress(search) ? (
            <SpinnerIcon className="text-primary h-6 w-6 animate-spin" />
          ) : (
            <Tooltip
              tip={`search on ${defaultChain?.name ?? "all chains"}`}
              className="tooltip-left md:tooltip-top"
            >
              <EVMChainsDropdown
                triggerClassName="btn-sm btn-circle"
                contentClassName="translate-x-4 translate-y-2 sm:w-96"
                compact
                selectedChain={defaultChain}
                onSelectChain={
                  !connectedChain
                    ? (chain) => setSelectedChainId(chain.chain_id)
                    : undefined
                }
              />
            </Tooltip>
          )}
        </span>
      </InputGroup>
      {((hasError && !searchERC20Result) ||
        (!isValidAddress && search.length >= 10)) && (
        <div role="alert" className="text-error absolute -bottom-9 p-2 text-sm">
          {(searchInterchainTokensError ?? searchERC20Error)?.message ??
            "Invalid ERC-20 token address"}
        </div>
      )}
    </FormControl>
  );
};

export default SearchInterchainTokens;
