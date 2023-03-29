import { FC } from "react";

import { Button } from "@axelarjs/ui";

import { useAddErc20StateContainer } from "../AddErc20.state";

export const Step1: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  return (
    <div className="grid-col-1 grid gap-y-2">
      <Button
        outline={state.newTokenType !== "new"}
        onClick={actions.setNewTokenType.bind(null, "new")}
      >
        New ERC-20 token
      </Button>
      <Button
        outline={state.newTokenType !== "existing"}
        onClick={actions.setNewTokenType.bind(null, "existing")}
      >
        Pre-Existing ERC-20 token
      </Button>
    </div>
  );
};
export default Step1;
