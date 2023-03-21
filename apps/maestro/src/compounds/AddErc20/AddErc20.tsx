import { FC, useMemo } from "react";

import { Button, Modal } from "@axelarjs/ui";

import { useAddErc20State } from "./AddErc20.state";
import { Step1, Step2, Step3, Step4 } from "./Steps";
import { TokenRegistration } from "./TokenRegistration";

const stepMap = [Step1, Step2, Step3, Step4];

export const AddErc20: FC<{}> = () => {
  const { state, actions } = useAddErc20State();
  const { step, newTokenType } = state;
  const { setStep, setNewTokenType } = actions;

  const CurrentStep = useMemo(() => {
    return stepMap[step];
  }, [step]);

  const back = () =>
    step === 0 ? (
      <Modal.CloseAction color="secondary">Close</Modal.CloseAction>
    ) : (
      <Button onClick={() => setStep(step - 1)}>Back</Button>
    );

  const forward = () =>
    step === stepMap.length - 1 ? (
      <Modal.CloseAction color="primary">Deploy</Modal.CloseAction>
    ) : (
      <Button onClick={() => setStep(step + 1)}>Next</Button>
    );

  return (
    <Modal triggerLabel="Deploy a new ERC-20 token">
      <Modal.Body>
        <TokenRegistration />
        <CurrentStep
          newTokenType={newTokenType}
          setNewTokenType={setNewTokenType}
        />
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
