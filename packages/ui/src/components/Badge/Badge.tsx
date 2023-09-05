import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledBadge = tw.span`pb-0.5`;

const badgeVariance = cva("badge", {
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

type BaseBadgeProps = ComponentProps<typeof StyledBadge>;

export interface BadgeProps
  extends BaseBadgeProps,
    VariantProps<typeof badgeVariance> {}

export const Badge: FC<BadgeProps> = ({
  outline,
  size,
  className,
  variant,
  ...props
}) => {
  return (
    <StyledBadge
      className={twMerge(badgeVariance({ outline, size, variant }), className)}
      {...props}
    />
  );
};
