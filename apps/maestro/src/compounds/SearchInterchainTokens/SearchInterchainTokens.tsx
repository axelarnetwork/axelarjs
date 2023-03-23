import { useEffect, useState } from "react";

import { TextInput } from "@axelarjs/ui";
import { useNetwork } from "wagmi";

import { useInterchainTokensQuery } from "~/services/gmp/hooks";

export type SearchInterchainTokens = {
  onTokenFound: (tookenId: string) => void;
};

export const SearchInterchainTokens = (props: SearchInterchainTokens) => {
  const [search, setSearch] = useState<string>("");

  const { chain } = useNetwork();

  const { data } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: search as `0x${string}`,
  });

  useEffect(() => {
    if (data?.tokenId) {
      props.onTokenFound(data.tokenId as `0x${string}`);
    }
  }, [data?.tokenId, props]);

  return (
    <TextInput
      bordered
      className="bprder-red block w-full max-w-sm"
      placeholder={`Search for ERC-20 token address on ${chain?.name}`}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
