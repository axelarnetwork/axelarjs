import type { ComponentProps } from "react";

import tw from "../../tw";

/**
 * A text input component
 */
export const TextInput = tw.input.cva("input", {
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

TextInput.displayName = "TextInput";
TextInput.defaultProps = {
  type: "text",
};

export interface TextInputProps extends ComponentProps<typeof TextInput> {
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  disabled?: boolean;
}
