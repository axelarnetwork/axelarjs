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
  },
});

type VProps = VariantProps<typeof inputVariance>;

type NativeElementProps = Omit<JSX.IntrinsicElements["input"], "type">;

export type TextInputProps = NativeElementProps &
  VProps & {
    type?: "text" | "password" | "email" | "number" | "tel" | "url";
  };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ color, inputSize, className, ...props }, ref) => (
    <input
      className={twMerge(
        inputVariance({
          color,
          inputSize,
        }),
        className
      )}
      {...props}
      ref={ref}
    />
  )
);

TextInput.defaultProps = {
  type: "text",
};
