import { ComponentProps } from "react";

import tw from "../../tw";

export const Loading = tw.span.cva("loading", {
  variants: {
    /**
     * The size of the loading indicator
     **/
    $size: {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
    },
    /**
     * The variant of the loading indicator, configurable in the theme
     **/
    $variant: {
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
    $shape: {
      spinner: "loading-spinner",
      dots: "loading-dots",
      ring: "loading-ring",
      ball: "loading-ball",
      bars: "loading-bars",
      infinity: "loading-infinity",
    },
  },
});

export type LoadingProps = ComponentProps<typeof Loading>;

Loading.defaultProps = {
  $shape: "spinner",
  $size: "md",
};
