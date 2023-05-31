import {
  FormControl,
  InputGroup,
  SpinnerIcon,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { useEffect, useState } from "react";

import { isAddress } from "viem";
import { useNetwork } from "wagmi";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useInterchainTokenDetailsQuery } from "~/services/interchainToken/hooks";

export type SearchInterchainTokens = {
  onTokenFound: (result: {
    tokenId?: `0x${string}`;
    tokenAddress: `0x${string}`;
  }) => void;
};

const SearchInterchainTokens = (props: SearchInterchainTokens) => {
  const [search, setSearch] = useState<string>("");

  const { chain } = useNetwork();
  const { data: evmChains } = useEVMChainConfigsQuery();

  const selectedChain = evmChains?.find((c) => c.chain_id === chain?.id);

  const isValidAddress = isAddress(search as `0x${string}`);

  const { data: tokenDetails } = useInterchainTokenDetailsQuery({
    chainId: chain?.id,
    tokenAddress: search as `0x${string}`,
  });

  const { data, error, isLoading } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: search as `0x${string}`,
  });

  useEffect(() => {
    if ((data?.tokenId && data.tokenAddress) || tokenDetails) {
      props.onTokenFound({
        tokenId: data.tokenId,
        tokenAddress: search as `0x${string}`,
      });
    }
  }, [data.tokenAddress, data.tokenId, props, search, tokenDetails]);

  return (
    <FormControl className="w-full max-w-xs md:max-w-md">
      <InputGroup>
        <TextInput
          bordered={true}
          type="search"
          name="tokenAddress"
          placeholder={`Search for ERC-20 token address on ${chain?.name}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          color={error ? "error" : undefined}
          className="flex-1"
        />
        <span>
          {isLoading && isAddress(search) ? (
            <SpinnerIcon className="text-primary h-6 w-6 animate-spin" />
          ) : (
            <Tooltip tip={chain?.name || ""}>
              <ChainIcon
                src={selectedChain?.image || ""}
                alt={chain?.name || ""}
                size="md"
              />
            </Tooltip>
          )}
        </span>
      </InputGroup>
      {((error && !tokenDetails) ||
        (!isValidAddress && search.length >= 10)) && (
        <div className="p-2 text-sm text-red-500">
          {error?.message ?? "Invalid ERC-20 token address"}
        </div>
      )}
    </FormControl>
  );
};

export default SearchInterchainTokens;
