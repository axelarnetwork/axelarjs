import { ComponentProps, FC } from "react";

import tw from "../../tw";

const StyledTooltip = tw.div.cva("tooltip", {
  variants: {
    $position: {
      top: "tooltip-top",
      right: "tooltip-right",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
    },
    $variant: {
      primary: "tooltip-primary",
      secondary: "tooltip-secondary",
      accent: "tooltip-accent",
      info: "tooltip-info",
      warning: "tooltip-warning",
      danger: "tooltip-error",
    },
    $open: {
      true: "tooltip-open",
    },
  },
});

type BaseTooltipProps = ComponentProps<typeof StyledTooltip>;

export interface TooltipProps extends BaseTooltipProps {
  tip: string;
}

export const Tooltip: FC<TooltipProps> = ({ tip, ...props }) => (
  <StyledTooltip {...props} data-tip={tip} />
);
