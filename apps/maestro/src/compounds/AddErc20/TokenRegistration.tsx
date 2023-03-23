import { FC, useMemo, useState } from "react";

import { useNetwork } from "wagmi";

import { EVMChainsDropdown } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

export const TokenRegistration: FC<{}> = () => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain: currentChain } = useNetwork();

  const [chainId, setChainId] = useState(currentChain?.id);

  const selectedChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === chainId),
    [chainId, evmChains]
  );
  return (
    <>
      <label>Register Origin Token On: </label>

      <EVMChainsDropdown
        selectedChain={selectedChain}
        chains={evmChains}
        onSwitchNetwork={(chain_id) => {
          const target = evmChains?.find((c) => c.chain_id === chain_id);
          if (target) {
            setChainId(target?.chain_id);
          }
        }}
      />
    </>
  );
};
