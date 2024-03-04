import { forwardRef, useEffect, type ComponentProps } from "react";

import { useSyncedRef } from "../../hooks";
import tw from "../../tw";

const StyledToggle = tw.input.cva("toggle", {
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
    inputSize: {
      xs: "toggle-xs",
      sm: "toggle-sm",
      md: "toggle-md",
      lg: "toggle-lg",
    },
  },
});

StyledToggle.defaultProps = {
  type: "checkbox",
};

type BaseToggleProps = ComponentProps<typeof StyledToggle>;

export interface ToggleProps extends BaseToggleProps {
  indeterminate?: boolean;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ indeterminate, ...props }, ref) => {
    const innerRef = useSyncedRef(ref);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    return <StyledToggle ref={innerRef} type="checkbox" {...props} />;
  }
);
