import type { FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const inputVariance = cva("input", {
  variants: {
    color: {
      primary: "input-primary",
      secondary: "input-secondary",
      accent: "input-accent",
      success: "input-success",
      warning: "input-warning",
      error: "input-error",
      info: "input-info",
    },
    inputSize: {
      xs: "input-xs",
      sm: "input-sm",
      md: "input-md",
      lg: "input-lg",
    },
  },
});

type VProps = VariantProps<typeof inputVariance>;

const StyledTextInput = tw.input`input`;

StyledTextInput.defaultProps = {
  type: "text",
};

export type TextInputProps = JSX.IntrinsicElements["input"] & VProps;

export const TextInput: FC<TextInputProps> = ({
  color,
  inputSize,
  className,
  ...props
}) => {
  return (
    <StyledTextInput
      className={twMerge(
        inputVariance({
          color,
          inputSize,
        }),
        className
      )}
      {...props}
    />
  );
};
