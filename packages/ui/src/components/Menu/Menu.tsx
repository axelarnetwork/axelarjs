import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import tw from "../../tw";

const StyledMenu = tw.ul`menu`;

export const menuVariance = cva("menu", {
  variants: {
    direction: {
      vertical: "menu-vertical",
      horizontal: "menu-horizontal",
    },
    size: {
      normal: "menu-normal",
      compact: "menu-compact",
    },
    rounded: {
      true: "rounded-box",
    },
  },
});

export const menuItemVariance = cva("menu-item", {
  variants: {
    active: {
      true: "active",
    },
    bordered: {
      true: "bordered",
      hover: "hover-bordered",
    },
    disabled: {
      true: "disabled",
    },
  },
});

export interface MenuProps
  extends ComponentProps<typeof StyledMenu>,
    VariantProps<typeof menuVariance> {}

const MenuRoot: FC<MenuProps> = ({
  direction,
  size,
  rounded,
  className,
  ...props
}) => (
  <StyledMenu
    className={twMerge(
      menuVariance({ direction, size, rounded, className }),
      className
    )}
    {...props}
  />
);

const StyledMenuItem = tw.li``;

export interface MenuItemProps
  extends ComponentProps<typeof StyledMenuItem>,
    VariantProps<typeof menuItemVariance> {}

const MenuItem: FC<MenuItemProps> = ({
  active,
  bordered,
  disabled,
  className,
  ...props
}) => (
  <StyledMenuItem
    className={twMerge(
      menuItemVariance({ active, bordered, disabled }),
      className
    )}
    {...props}
  />
);

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Title: tw(MenuItem)`menu-title`,
});
