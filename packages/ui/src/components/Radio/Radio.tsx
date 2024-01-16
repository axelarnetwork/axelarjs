import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const inputVariance = cva("radio", {
  variants: {
    variant: {
      primary: "radio-primary",
      secondary: "radio-secondary",
      accent: "radio-accent",
      success: "radio-success",
      warning: "radio-warning",
      error: "radio-error",
      info: "radio-info",
    },
    inputSize: {
      xs: "radio-xs",
      sm: "radio-sm",
      md: "radio-md",
      lg: "radio-lg",
    },
  },
});

type VProps = VariantProps<typeof inputVariance>;

type InputElement = Omit<JSX.IntrinsicElements["input"], "type" | "color">;

export interface RadioProps extends InputElement, VProps {
  type?: never;
  placeholder?: never;
}

/**
 * A radio input component
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ variant, inputSize, className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
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

Radio.displayName = "Radio";
