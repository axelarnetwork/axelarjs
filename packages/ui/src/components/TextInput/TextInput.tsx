import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const inputVariance = cva("input", {
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

type VProps = VariantProps<typeof inputVariance>;

type NativeElementProps = Omit<
  JSX.IntrinsicElements["input"],
  "type" | "color"
>;

export interface TextInputProps extends NativeElementProps, VProps {
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  disabled?: boolean;
}

/**
 * A text input component
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      variant: color,
      inputSize,
      ghost,
      bordered,
      className,
      disabled,
      ...props
    },
    ref
  ) => (
    <input
      className={twMerge(
        inputVariance({
          bordered,
          variant: color,
          inputSize,
          ghost,
          disabled,
        }),
        className
      )}
      disabled={Boolean(disabled)}
      {...props}
      ref={ref}
    />
  )
);

TextInput.displayName = "TextInput";
TextInput.defaultProps = {
  type: "text",
};
