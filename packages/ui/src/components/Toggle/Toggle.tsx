import { forwardRef, useEffect } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { useSyncedRef } from "../../hooks";

const toggleVariance = cva("toggle", {
  variants: {
    variant: {
      primary: "toggle-primary",
      secondary: "toggle-secondary",
      accent: "toggle-accent",
      info: "toggle-info",
      success: "toggle-success",
      warning: "toggle-warning",
      error: "toggle-error",
    },
    size: {
      xs: "toggle-xs",
      sm: "toggle-sm",
      md: "toggle-md",
      lg: "toggle-lg",
    },
  },
});

type VProps = VariantProps<typeof toggleVariance>;

type BaseToggleProps = Omit<
  JSX.IntrinsicElements["input"],
  "type" | "size" | "color"
>;

export interface ToggleProps extends BaseToggleProps, VProps {
  indeterminate?: boolean;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ variant, size, className, indeterminate, ...props }, ref) => {
    const innerRef = useSyncedRef(ref);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    return (
      <input
        ref={innerRef}
        type="checkbox"
        className={twMerge(toggleVariance({ variant, size }), className)}
        {...props}
      />
    );
  }
);
