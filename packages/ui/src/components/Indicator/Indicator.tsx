import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "styled-cva";

import tw from "../../tw";
import { cn } from "../../utils";
import { Badge } from "../Badge";

const StyledIndicator = tw.div`indicator`;

const indicatorItemVariance = cva("indicator-item", {
  variants: {
    $position: {
      top: "indicator-top",
      bottom: "indicator-bottom",
      center: "indicator-center",
      middle: "indicator-middle",
      start: "indicator-start",
      end: "indicator-end",
    },
  },
});

export interface IndicatorProps
  extends ComponentProps<typeof StyledIndicator> {}

export interface IndicatorItemProps
  extends ComponentProps<typeof Badge>,
    VariantProps<typeof indicatorItemVariance> {}

const IndicatorItem: FC<IndicatorItemProps> = ({
  $position,
  className,
  ...props
}) => (
  <Badge
    className={cn(indicatorItemVariance({ $position, className }))}
    {...props}
  />
);

export const Indicator = Object.assign(StyledIndicator, {
  Item: IndicatorItem,
});
