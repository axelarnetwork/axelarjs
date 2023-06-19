import { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { Loading } from "../Loading";

export const buttonVariance = cva("btn", {
  variants: {
    /**
     * The size of the button
     **/
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    },
    /**
     * The color of the button, configurable in the theme
     *
     * @deprecated Use `variant` instead
     **/
    color: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      neutral: "btn-neutral",
      accent: "btn-accent",
      info: "btn-info",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
      ghost: "btn-ghost",
      link: "btn-link",
    },
    variant: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      neutral: "btn-neutral",
      accent: "btn-accent",
      info: "btn-info",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
      ghost: "btn-ghost",
      link: "btn-link",
    },
    /**
     * The shape of the button (circle or square)
     **/
    shape: {
      square: "btn-square",
      circle: "btn-circle",
    },
    /**
     * Renders a wireframe button
     **/
    outline: {
      true: "btn-outline",
    },
    /**
     * Renders a disabled button
     **/
    disabled: {
      true: "btn-disabled",
    },
    /**
     * Renders a ghost button, which is a transparent button with no border
     *
     * @deprecated Use `color="ghost"` instead
     **/
    ghost: {
      true: "btn-ghost",
    },
    /**
     * Renders a glass button, which is a semi transparent with a glass effect
     **/
    glass: {
      true: "glass",
    },
    /**
     * Renders a link button, which looks like a link
     *
     * @deprecated Use `color="link"` instead
     **/
    link: {
      true: "btn-link",
    },
    length: {
      wide: "btn-wide",
      block: "btn-block",
    },
  },
});

type VProps = VariantProps<typeof buttonVariance>;

export type ButtonProps = JSX.IntrinsicElements["button"] &
  VProps & {
    loading?: boolean;
  };

export type LinkButtonProps = JSX.IntrinsicElements["a"] &
  VProps & {
    loading?: boolean;
  };

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
    length,
    link,
    loading,
    children,
    variant,
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
        length,
        variant,
      }),
      className
    ),
    componentProps,
  ] as const;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [className, componentProps] = getSegmentedProps(props);

    return (
      <button
        disabled={props.disabled}
        className={className}
        {...componentProps}
        ref={ref}
      >
        {props.loading && (
          <Loading
            size={props.size === "xs" ? "xs" : "sm"}
            variant={props.variant}
          />
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (props, ref) => {
    const [classes, componentProps] = getSegmentedProps(props);

    return (
      <a className={classes} {...componentProps} ref={ref}>
        {props.children}
      </a>
    );
  }
);

LinkButton.displayName = "LinkButton";

Button.defaultProps = {
  type: "button",
};
