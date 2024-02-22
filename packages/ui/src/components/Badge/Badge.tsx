import type { ComponentProps } from "react";

import tw from "../../tw";

export const Badge = tw.span.cva("badge", {
  variants: {
    variant: {
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      neutral: "badge-neutral",
      success: "badge-success",
      error: "badge-error",
      warning: "badge-warning",
      info: "badge-info",
    },
    size: {
      xs: "badge-xs",
      sm: "badge-sm",
      md: "badge-md",
      lg: "badge-lg",
    },
    outline: {
      true: "badge-outline",
    },
  },
});

export type BadgeProps = ComponentProps<typeof Badge>;
