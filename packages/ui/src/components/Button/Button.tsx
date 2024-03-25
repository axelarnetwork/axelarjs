import { forwardRef } from "react";

import { cva, VariantProps } from "styled-cva";
import { twMerge } from "tailwind-merge";

import { Loading } from "../Loading";

export const buttonVariance = cva("btn disabled:btn-disabled", {
  variants: {
    /**
     * The size of the button
     **/
    $size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    },
    $variant: {
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
    $shape: {
      square: "btn-square",
      circle: "btn-circle",
    },
    /**
     * Renders a wireframe button
     **/
    $outline: {
      true: "btn-outline",
    },
    /**
     * Renders a glass button, which is a semi transparent with a glass effect
     **/
    $glass: {
      true: "glass",
    },
    $length: {
      wide: "btn-wide",
      block: "btn-block",
    },
    $loading: {
      true: "pointer-events-none",
    },
  },
});

type VProps = VariantProps<typeof buttonVariance>;

type ButtonElement = Omit<JSX.IntrinsicElements["button"], "color">;

export interface ButtonProps extends ButtonElement, VProps {
  /**
   * @deprecated Use $loading instead @see $loading
   */
  loading?: never;
  disabled?: boolean;
}

type LinkElement = JSX.IntrinsicElements["a"];

export interface LinkButtonProps extends LinkElement, VProps {
  /**
   * @deprecated Use $loading instead @see $loading
   */
  loading?: never;
  disabled?: boolean;
}

const getSegmentedProps = <T extends ButtonProps | LinkButtonProps>(
  props: T
) => {
  const {
    className,
    $size,
    $shape,
    $glass,
    $outline,
    $length,
    $loading,
    $variant,
    ...componentProps
  } = props;

  return [
    twMerge(
      buttonVariance({
        $size,
        $shape,
        $outline,
        $glass,
        $length,
        $variant,
        $loading,
      }),
      className
    ),
    componentProps,
  ] as const;
};

/**
 * A button component
 *
 * @param {ButtonProps} props
 * @returns {JSX.Element}
 *
 * @example
 * <Button variant="primary" size="sm" shape="square" outline>
 *  Hello World
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [className, componentProps] = getSegmentedProps(props);

    return (
      <button
        disabled={Boolean(props.disabled)}
        className={className}
        {...componentProps}
        ref={ref}
      >
        {props.$loading && (
          <Loading $size={props.$size === "xs" ? "xs" : "sm"} />
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * A link component that looks like a button
 *
 * @param {LinkButtonProps} props
 * @returns {JSX.Element}
 *
 * @example
 * <LinkButton variant="primary" size="sm" shape="square" outline>
 *  Hello World
 * </LinkButton>
 */
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
