import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledBadge = tw.span``;

const badgeVariance = cva("badge", {
  variants: {
    /**
     * @deprecated Use `variant` instead
     */
    color: {
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      neutral: "badge-neutral",
      success: "badge-success",
      error: "badge-error",
      warning: "badge-warning",
      info: "badge-info",
      ghost: "badge-ghost",
    },
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
    /**
     * @deprecated Use `variant='ghost'` instead
     */
    ghost: {
      true: "badge-ghost",
    },
  },
});

export type BadgeProps = ComponentProps<typeof StyledBadge> &
  VariantProps<typeof badgeVariance>;

export const Badge: FC<BadgeProps> = ({
  color,
  outline,
  ghost,
  size,
  className,
  variant,
  ...props
}) => {
  return (
    <StyledBadge
      className={twMerge(
        badgeVariance({ color, outline, ghost, size, variant }),
        className
      )}
      {...props}
    />
  );
};
