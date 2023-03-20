import { FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonVariance = cva("btn", {
  variants: {
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    },
    color: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      info: "btn-info",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
    },
    shape: {
      square: "btn-square",
      circle: "btn-circle",
    },
    outline: {
      true: "btn-outline",
    },
    disabled: {
      true: "btn-disabled",
    },
    ghost: {
      true: "btn-ghost",
    },
    glass: {
      true: "glass",
    },
    link: {
      true: "btn-link",
    },
    loading: {
      true: "loading",
    },
  },
});

type VProps = VariantProps<typeof buttonVariance>;

export type ButtonProps = JSX.IntrinsicElements["button"] & VProps & {};
export type LinkButtonProps = JSX.IntrinsicElements["a"] & VProps & {};

const getSegmentedProps = <T extends ButtonProps | LinkButtonProps>(
  props: T
) => {
  const {
    className,
    size,
    color,
    disabled,
    shape,
    ghost,
    glass,
    outline,
    link,
    loading,
    children,
    ...componentProps
  } = props;

  return [
    twMerge(
      buttonVariance({
        size,
        color,
        disabled,
        shape,
        ghost,
        outline,
        link,
        glass,
        loading,
      }),
      className
    ),
    componentProps,
  ] as const;
};

export const Button: FC<ButtonProps> = (props) => {
  const [className, componentProps] = getSegmentedProps(props);

  return (
    <button disabled={props.disabled} className={className} {...componentProps}>
      {props.children}
    </button>
  );
};

export const LinkButton: FC<LinkButtonProps> = (props) => {
  const [classes, componentProps] = getSegmentedProps(props);

  return (
    <a className={classes} {...componentProps}>
      {props.children}
    </a>
  );
};

Button.defaultProps = {
  type: "button",
};
