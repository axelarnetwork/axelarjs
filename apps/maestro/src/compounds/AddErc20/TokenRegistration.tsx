import { FC, useMemo, useState } from "react";

import { useNetwork, useSwitchNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

import { useAddErc20StateContainer } from "./AddErc20.state";

export const TokenRegistration: FC<{}> = () => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [chainId, setChainId] = useState(currentChain?.id);

  const { state } = useAddErc20StateContainer();

  const selectedChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === chainId),
    [chainId, evmChains]
  );
  return (
    <>
      <label>Register Origin Token On: </label>
      <EVMChainsDropdown
        compact={true}
        selectedChain={selectedChain}
        chains={evmChains}
        onSwitchNetwork={(chain_id) => {
          const target = evmChains?.find((c) => c.chain_id === chain_id);
          if (target) {
            setChainId(target.chain_id);
            switchNetwork?.(target.chain_id);
          }
        }}
        disabled={state.step > 1}
      />
    </>
  );
};
