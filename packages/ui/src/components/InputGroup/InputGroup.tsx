import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledInputGroup = tw.label``;

const inputGroupVariance = cva("input-group", {
  variants: {
    size: {
      xs: "input-group-xs",
      sm: "input-group-sm",
      md: "input-group-md",
      lg: "input-group-lg",
    },
    vertical: {
      true: "input-group-vertical",
    },
  },
});

type BaseInputGroupProps = VariantProps<typeof inputGroupVariance>;

export type InputGroupProps = ComponentProps<typeof StyledInputGroup> &
  BaseInputGroupProps;

export const InputGroup: FC<InputGroupProps> = ({
  size,
  vertical,
  className,
  ...props
}) => (
  <StyledInputGroup
    className={twMerge(
      inputGroupVariance({
        size,
        vertical,
      }),
      className
    )}
    {...props}
  />
);
