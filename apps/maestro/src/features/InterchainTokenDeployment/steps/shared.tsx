import { ArrowLeftIcon, Button, ChevronRightIcon, cn } from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import type { ComponentProps, FC } from "react";

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
