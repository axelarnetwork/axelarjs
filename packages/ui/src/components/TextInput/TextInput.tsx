import { forwardRef, type ComponentProps } from "react";

import tw from "../../tw";

/**
 * A text input component
 */
const StyledTextInput = tw.input.cva("input", {
  variants: {
    variant: {
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
    ghost: {
      true: "input-ghost",
    },
    bordered: {
      true: "input-bordered",
    },
    disabled: {
      true: "input-disabled",
    },
  },
});

StyledTextInput.displayName = "TextInput";
StyledTextInput.defaultProps = {
  type: "text",
};

export interface TextInputProps extends ComponentProps<typeof StyledTextInput> {
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  disabled?: boolean;
}

// this is only forwarded so the `type` prop can is restricted to the types we want
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => <StyledTextInput {...props} ref={ref} />
);
