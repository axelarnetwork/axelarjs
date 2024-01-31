import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const progressVariance = cva("progress", {
  variants: {
    variant: {
      primary: "progress-primary",
      secondary: "progress-secondary",
      accent: "progress-accent",
      info: "progress-info",
      success: "progress-success",
      warning: "progress-warning",
      error: "progress-error",
    },
  },
});

type VProps = VariantProps<typeof progressVariance>;

type ProgressElement = JSX.IntrinsicElements["progress"];

export interface ProgressProps extends ProgressElement, VProps {}

/**
 * A progress component
 *
 * @param {ProgressProps} props
 * @returns {JSX.Element}
 *
 * @example
 
 * <Progress variant="accent" value={10} max={25} />
 */
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, ...props }, ref) => {
    return (
      <progress
        className={twMerge(
          progressVariance({
            variant: props.variant,
          }),
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

Progress.displayName = "Button";
