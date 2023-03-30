import { FC } from "react";

import { FormControl, Label, TextInput } from "@axelarjs/ui";
import clsx from "clsx";

import { useAddErc20StateContainer } from "~/compounds/AddErc20";

export const NewERC20Token: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <FormControl>
        <Label>Token Name</Label>
        <TextInput
          bordered
          value={state.tokenName}
          onChange={(e) => actions.setTokenName(e.target.value)}
          placeholder="Enter your token name"
        />
      </FormControl>
      <FormControl>
        <Label>Token Symbol</Label>
        <TextInput
          bordered
          value={state.tokenSymbol}
          onChange={(e) => actions.setTokenSymbol(e.target.value)}
          placeholder="Enter your token symbol"
          maxLength={11}
          className={clsx({
            uppercase: state.tokenSymbol.length > 0,
          })}
        />
      </FormControl>
      <FormControl>
        <Label>Token Decimals</Label>
        <TextInput
          bordered
          type="number"
          value={state.decimals}
          onChange={(e) => actions.setDecimals(parseInt(e.target.value))}
          placeholder="Enter your token decimals"
          min={0}
        />
      </FormControl>
      <FormControl>
        <Label>Amount to mint (leave zero for none)</Label>
        <TextInput
          bordered
          type="number"
          value={state.amountToMint}
          onChange={(e) => actions.setAmountToMint(parseInt(e.target.value))}
          placeholder="Enter your amount to mint"
          min={0}
        />
      </FormControl>
    </div>
  );
};
