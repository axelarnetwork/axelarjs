import {
  ArrowLeftIcon,
  Button,
  ChevronRightIcon,
  cn,
  LinkButton,
  TextInput,
} from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import type { ComponentProps, FC } from "react";
import type { FieldError } from "react-hook-form";

const StyledButton = tw(Button)`gap-2`;

export const NextButton: FC<ComponentProps<typeof Button>> = ({
  children,
  ...props
}) => {
  return (
    <StyledButton {...props}>
      {children} <ChevronRightIcon className={cn({ hidden: props.loading })} />
    </StyledButton>
  );
};

export const PrevButton: FC<ComponentProps<typeof Button>> = ({
  children,
  ...props
}) => {
  return (
    <StyledButton {...props}>
      <ArrowLeftIcon /> {children}
    </StyledButton>
  );
};

export const ModalFormInput = Object.assign({}, TextInput, {
  defaultProps: {
    ...TextInput.defaultProps,
    className: "bg-base-200",
    bordered: true,
  },
}) as typeof TextInput;

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

export const TriggerButton = (props: ComponentProps<typeof Button>) => (
  <Button
    {...props}
    size="md"
    className="w-full max-w-xs md:max-w-md"
    variant="primary"
  >
    {props.children}
  </Button>
);

export const BackButton = (props: ComponentProps<typeof PrevButton>) => (
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
