import { FC, useMemo, useState } from "react";

import { useNetwork } from "wagmi";

import { EVMChainsDropdown } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

export const TokenRegistration: FC<{}> = () => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain: currentChain } = useNetwork();
  const [chain, setChain] = useState<any>({
    ...currentChain,
    chain_id: currentChain?.id,
  });
  const selectedChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === chain?.chain_id),
    [chain, evmChains]
  );
  return (
    <div>
      <label>Register Origin Token On: </label>
      <EVMChainsDropdown
        selectedChain={selectedChain}
        chains={evmChains}
        onSwitchNetwork={(chain_id) =>
          setChain(evmChains?.find((c) => c.chain_id === chain_id))
        }
      />
    </div>
  );
};
