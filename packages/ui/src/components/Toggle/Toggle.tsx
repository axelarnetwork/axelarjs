import { FC, useEffect, useRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledToggle = tw.input``;

StyledToggle.defaultProps = {
  type: "checkbox",
};

const toggleVariance = cva("toggle", {
  variants: {
    color: {
      primary: "toggle-primary",
      secondary: "toggle-secondary",
      accent: "toggle-accent",
      success: "toggle-success",
      warning: "toggle-warning",
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

export type ToggleProps = Omit<JSX.IntrinsicElements["input"], "type"> &
  VProps & {
    indeterminate?: boolean;
  };

export const Toggle: FC<ToggleProps> = ({
  color,
  size,
  className,
  indeterminate,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={twMerge(toggleVariance({ color, size }), className)}
      {...props}
    />
  );
};
