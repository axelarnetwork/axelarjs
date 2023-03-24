import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

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

type VProps = VariantProps<typeof inputVariance>;

type NativeElementProps = Omit<JSX.IntrinsicElements["input"], "type">;

export type TextInputProps = NativeElementProps &
  VProps & {
    type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  };

/**
 * A text input component
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ color, inputSize, ghost, bordered, className, ...props }, ref) => (
    <input
      className={twMerge(
        inputVariance({
          bordered,
          color,
          inputSize,
          ghost,
          disabled: props.disabled,
        }),
        className
      )}
      {...props}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";
TextInput.defaultProps = {
  type: "text",
};
