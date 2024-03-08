import { type ComponentProps } from "react";

import tw from "../../tw";

/**
 * A radio input component
 */
export const Radio = tw.input.cva("radio", {
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

Radio.defaultProps = {
  type: "radio",
};

export interface RadioProps extends ComponentProps<typeof Radio> {
  type: never;
  placeholder: never;
}
