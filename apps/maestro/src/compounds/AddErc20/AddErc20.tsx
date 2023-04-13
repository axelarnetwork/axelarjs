import { FC, useMemo } from "react";

import { LinkButton, Modal } from "@axelarjs/ui";
import dynamic from "next/dynamic";

import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
} from "./AddErc20.state";
import { TokenRegistration } from "./TokenRegistration";

const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton loading ghost length="block" className="pointer-events-none">
      Loading...
    </LinkButton>
  </div>
);

const Step1 = dynamic(
  () => import("~/compounds/AddErc20/steps/token-details"),
  {
    loading: StepLoading,
  }
);

const Step2 = dynamic(
  () => import("~/compounds/AddErc20/steps/deploy-and-register"),
  {
    loading: StepLoading,
  }
);

const Step3 = dynamic(() => import("~/compounds/AddErc20/steps/review"), {
  loading: StepLoading,
});

const StepsSummary = dynamic(
  () => import("~/compounds/AddErc20/steps/StepsSummary")
);

const STEPS = [Step1, Step2, Step3];

type AddErc20Props = {
  trigger?: JSX.Element;
  tokenDetails?: {
    name: string;
    symbol: string;
    decimals: number;
    address: `0x${string}`;
  };
};

const AddErc20: FC<AddErc20Props> = (props) => {
  const { state } = useAddErc20StateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const conditionalProps = props.trigger
    ? { trigger: props.trigger }
    : { triggerLabel: "Deploy a new ERC-20 token" };

  return (
    <Modal {...conditionalProps} hideCloseButton>
      <Modal.Body>
        <Modal.Title className="flex items-center gap-2">
          <TokenRegistration />
        </Modal.Title>
        <StepsSummary
          currentStep={state.step}
          newTokenType={state.newTokenType}
        />
        <CurrentStep />
      </Modal.Body>
    </Modal>
  );
};

const AddErc20WithProvider = (props: AddErc20Props) => {
  return (
    <AddErc20StateProvider
      initialState={
        props.tokenDetails
          ? {
              newTokenType: "existing",
              deployedTokenAddress: props.tokenDetails.address,
              tokenName: props.tokenDetails.name,
              tokenDecimals: props.tokenDetails.decimals,
              isPreExistingToken: true,
              tokenSymbol: props.tokenDetails.symbol,
            }
          : undefined
      }
    >
      <AddErc20 {...props} />
    </AddErc20StateProvider>
  );
};

export default AddErc20WithProvider;
