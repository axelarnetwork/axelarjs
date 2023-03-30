import { ComponentProps, FC } from "react";

import { Button } from "@axelarjs/ui";
import { ChevronLeft } from "lucide-react";
import tw from "tailwind-styled-components";

const StyledButton = tw(Button)`gap-2`;

export const NextButton: FC<ComponentProps<typeof Button>> = ({
  children,
  ...props
}) => {
  return (
    <StyledButton {...props}>
      {children} <ChevronLeft className="rotate-180" />
    </StyledButton>
  );
};

export const PrevButton: FC<ComponentProps<typeof Button>> = ({
  children,
  ...props
}) => {
  return (
    <StyledButton {...props}>
      <ChevronLeft /> {children}
    </StyledButton>
  );
};
