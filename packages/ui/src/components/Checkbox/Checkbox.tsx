import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const inputVariance = cva("checkbox", {
  variants: {
    variant: {
      primary: "checkbox-primary",
      secondary: "checkbox-secondary",
      accent: "checkbox-accent",
      success: "checkbox-success",
      warning: "checkbox-warning",
      error: "checkbox-error",
      info: "checkbox-info",
    },
    inputSize: {
      xs: "checkbox-xs",
      sm: "checkbox-sm",
      md: "checkbox-md",
      lg: "checkbox-lg",
    },
  },
});

type VProps = VariantProps<typeof inputVariance>;

type InputElement = Omit<JSX.IntrinsicElements["input"], "type" | "color">;

export interface CheckboxProps extends InputElement, VProps {
  type?: never;
  placeholder?: never;
}

/**
 * A text input component
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ variant, inputSize, className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={twMerge(
        inputVariance({
          variant,
          inputSize,
        }),
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
