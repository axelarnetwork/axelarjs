import { FC } from "react";

import { TextInput } from "@axelarjs/ui";

import { useAddErc20StateContainer } from "../../AddErc20.state";

export const NewERC20Token: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <label className="text-sm">Token Name</label>
      <TextInput
        inputSize={"md"}
        color={"primary"}
        value={state.tokenName}
        onChange={(e) => actions.setTokenName(e.target.value)}
        placeholder="Input your token name"
      />
      <label className="text-sm">Token Symbol</label>
      <TextInput
        inputSize={"md"}
        color={"primary"}
        value={state.tokenSymbol}
        onChange={(e) => actions.setTokenSymbol(e.target.value)}
        placeholder="Input your token symbol"
      />
      <label className="text-sm">Token Decimals</label>
      <TextInput
        inputSize={"md"}
        type={"number"}
        color={"primary"}
        value={state.decimals}
        onChange={(e) => actions.setDecimals(parseInt(e.target.value))}
        placeholder="Input your token decimals"
      />
      <label className="text-sm">Amount to mint (leave zero for none)</label>
      <TextInput
        inputSize={"md"}
        type={"number"}
        color={"primary"}
        value={state.amountToMint}
        onChange={(e) => actions.setAmountToMint(parseInt(e.target.value))}
        placeholder="Input your amount to mint"
      />
    </div>
  );
};
