import {
  ArrowLeftIcon,
  Button,
  ChevronRightIcon,
  cn,
  LinkButton,
  Steps,
  TextInput,
  useWindowSize,
} from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import type { ComponentProps, FC } from "react";
import type { FieldError } from "react-hook-form";

import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";

type ButtonProps = ComponentProps<typeof Button>;

export const ModalFormInput = Object.assign({}, TextInput, {
  defaultProps: {
    ...TextInput.defaultProps,
    className: "bg-base-200",
    bordered: true,
  },
}) as typeof TextInput;

const StyledButton = tw(Button)`gap-2`;

export const NextButton: FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    {children} <ChevronRightIcon className={cn({ hidden: props.loading })} />
  </StyledButton>
);

export const PrevButton: FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    <ArrowLeftIcon /> {children}
  </StyledButton>
);

export const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton
      loading
      variant="ghost"
      length="block"
      className="pointer-events-none"
    >
      Loading...
    </LinkButton>
  </div>
);

export const TriggerButton: FC<ButtonProps> = (props) => (
  <Button
    {...props}
    size="md"
    className="w-full max-w-xs md:max-w-md"
    variant="primary"
  >
    {props.children}
  </Button>
);

export const BackButton: FC<ButtonProps> = (props) => (
  <PrevButton
    {...props}
    shape="square"
    size="lg"
    className="absolute left-0 top-0 rounded-none rounded-br-2xl"
  >
    {props.children}
  </PrevButton>
);

export const ValidationError: FC<FieldError> = ({ message }) => (
  <div role="alert" className="text-error p-1.5 text-xs">
    {message}
  </div>
);

export type StepsSummaryProps = {
  currentStep: number;
};

const STEPS = ["Token details", "Deploy & Register", "Review"];

export const StepsSummary: FC<StepsSummaryProps> = (
  props: StepsSummaryProps
) => {
  return (
    <Steps className="my-6 h-20 w-full text-sm sm:my-10 sm:h-24">
      {STEPS.map((step, index) => (
        <Steps.Step key={step} active={props.currentStep >= index}>
          {step}
        </Steps.Step>
      ))}
    </Steps>
  );
};

export const ChainsDropdown: FC<{ disabled?: boolean; shift?: boolean }> = (
  props
) => {
  const { width } = useWindowSize();
  return (
    <EVMChainsDropdown
      compact
      disabled={props.disabled}
      triggerClassName="-translate-y-1.5"
      hideLabel={width < 640}
      contentClassName={cn("translate-x-28 sm:translate-x-12 z-40", {
        "translate-x-16 sm:translate-x-0": props.shift,
      })}
    />
  );
};
