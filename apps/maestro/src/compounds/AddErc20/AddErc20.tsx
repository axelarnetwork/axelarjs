import { FC, useMemo, useState } from "react";

import { Button, Modal } from "@axelarjs/ui";
import { useNetwork } from "wagmi";

import { EVMChainsDropdown } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

import { useAddErc20State } from "./AddErc20.state";

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

type StepProps = {};
export const Step1: FC<StepProps> = (props: StepProps) => {
  return (
    <div className="grid-col-1 grid gap-y-2">
      <Button outline>New ERC-20 token</Button>
      <Button outline>Pre-Existing ERC-20 token</Button>
    </div>
  );
};
export const Step2: FC<StepProps> = (props: StepProps) => {
  return <div>hi 2</div>;
};
export const Step3: FC<StepProps> = (props: StepProps) => {
  return <div>hi 3</div>;
};
export const Step4: FC<StepProps> = (props: StepProps) => {
  return <div>hi 4</div>;
};

type Props = {};

const stepMap = [Step1, Step2, Step3, Step4];

export const AddErc20: FC<Props> = (props) => {
  const { state, actions } = useAddErc20State();
  const { step } = state;
  const { setStep } = actions;

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
        <CurrentStep />
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
