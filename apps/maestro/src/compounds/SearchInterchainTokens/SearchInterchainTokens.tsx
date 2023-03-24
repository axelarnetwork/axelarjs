import { useEffect, useState } from "react";

import { InputGroup, SpinnerIcon, TextInput, Tooltip } from "@axelarjs/ui";
import { useNetwork } from "wagmi";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

export type SearchInterchainTokens = {
  onTokenFound: (result: {
    tokenId: `0x${string}`;
    tokenAddress: `0x${string}`;
  }) => void;
};

const SearchInterchainTokens = (props: SearchInterchainTokens) => {
  const [search, setSearch] = useState<string>("");

  const { chain } = useNetwork();
  const { data: evmChains } = useEVMChainConfigsQuery();

  const selectedChain = evmChains?.find((c) => c.chain_id === chain?.id);

  const { data, isFetching } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: search as `0x${string}`,
  });

  useEffect(() => {
    if (data?.tokenId && data.tokenAddress) {
      props.onTokenFound({
        tokenId: data.tokenId,
        tokenAddress: data.tokenAddress,
      });
    }
  }, [data.tokenAddress, data.tokenId, props]);

  return (
    <InputGroup className="max-w-md">
      <TextInput
        bordered
        type="search"
        className="bprder-red mx-auto block w-full"
        placeholder={`Search for ERC-20 token address on ${chain?.name}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <span>
        {isFetching ? (
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
  );
};

export default SearchInterchainTokens;
