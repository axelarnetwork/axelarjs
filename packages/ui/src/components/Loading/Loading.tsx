import { FC, forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const loadingVariance = cva("btn", {
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
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
      neutral: "text-neutral",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      ghost: "text-ghost",
      link: "text-link",
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

type VProps = VariantProps<typeof loadingVariance>;

export type LoadingProps = JSX.IntrinsicElements["span"] & VProps;

export type LinkLoadingProps = JSX.IntrinsicElements["a"] &
  VProps & {
    loading?: boolean;
  };

const getSegmentedProps = <T extends LoadingProps | LinkLoadingProps>(
  props: T
) => {
  const { className, size, variant, shape, children, ...componentProps } =
    props;

  return [
    twMerge(loadingVariance({ size, variant, shape }), className),
    componentProps,
  ] as const;
};

export const Loading: FC<LoadingProps> = (props) => {
  const [className, componentProps] = getSegmentedProps(props);

  return <Loading className={className} {...componentProps} />;
};

Loading.defaultProps = {
  shape: "spinner",
};
