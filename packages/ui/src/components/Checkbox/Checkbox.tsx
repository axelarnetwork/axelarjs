import { forwardRef, type ComponentProps } from "react";

import tw from "../../tw";

const StyledInput = tw.input.cva("checkbox", {
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

type InputElement = Omit<ComponentProps<typeof StyledInput>, "type" | "color">;

export interface CheckboxProps extends InputElement {
  type?: never;
  placeholder?: never;
}

/**
 * A checkbox input component
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ ...props }, ref) => <StyledInput ref={ref} type="checkbox" {...props} />
);

Checkbox.displayName = "Checkbox";
