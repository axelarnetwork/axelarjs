import { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

export const loadingVariance = cva("loading", {
  variants: {
    /**
     * The size of the loading indicator
     **/
    size: {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
    },
    /**
     * The color of the loading indicator, configurable in the theme
     **/
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      neutral: "text-neutral",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
    /**
     * The shape of the loading indicator (circle or square)
     **/
    shape: {
      spinner: "loading-spinner",
      dots: "loading-dots",
      ring: "loading-ring",
      ball: "loading-ball",
      bars: "loading-bars",
      infinity: "loading-infinity",
    },
  },
});

const StyledLoading = tw.span``;

export type LoadingProps = ComponentProps<typeof StyledLoading> &
  VariantProps<typeof loadingVariance>;

export const Loading: FC<LoadingProps> = ({
  shape,
  size,
  color,
  className,
  children,
  ...props
}) => (
  <StyledLoading
    className={twMerge(loadingVariance({ shape, color, size }), className)}
    {...props}
  />
);

Loading.defaultProps = {
  shape: "spinner",
  size: "md",
};
