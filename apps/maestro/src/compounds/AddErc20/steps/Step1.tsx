import { FC } from "react";

import { Button, Modal } from "@axelarjs/ui";
import { X } from "lucide-react";

import { useAddErc20StateContainer } from "../AddErc20.state";
import { NextButton } from "./core";

const Step1: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  return (
    <>
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
      <Modal.Actions>
        <Modal.CloseAction className="gap-2">
          <X />
          Reset & Close
        </Modal.CloseAction>
        <NextButton onClick={() => actions.setStep(state.step + 1)}>
          Token Details
        </NextButton>
      </Modal.Actions>
    </>
  );
};

export default Step1;
