import { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";

import tw from "../../tw";

const variance = cva("tooltip", {
  variants: {
    position: {
      top: "tooltip-top",
      right: "tooltip-right",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
    },
    variant: {
      primary: "tooltip-primary",
      secondary: "tooltip-secondary",
      accent: "tooltip-accent",
      info: "tooltip-info",
      warning: "tooltip-warning",
      danger: "tooltip-error",
    },
    open: {
      true: "tooltip-open",
    },
  },
});

const StyledTooltip = tw.div``;

type BaseTooltipProps = Omit<ComponentProps<typeof StyledTooltip>, "color">;
type VProps = VariantProps<typeof variance>;

export interface TooltipProps extends BaseTooltipProps, VProps {
  tip: string;
}

export const Tooltip: FC<TooltipProps> = ({
  tip,
  className,
  children,
  position,
  variant,
  open,
  ...props
}) => (
  <StyledTooltip
    {...props}
    className={variance({ className, position, variant, open })}
    data-tip={tip}
  >
    {children}
  </StyledTooltip>
);
