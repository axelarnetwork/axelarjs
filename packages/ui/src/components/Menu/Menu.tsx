import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import tw from "tailwind-styled-components";

const StyledMenu = tw.ul`menu`;

const StyledMenuItem = tw.li``;

const menuVariance = cva("menu", {
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

const menuItemVariance = cva("menu-item", {
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

export type MenuProps = ComponentProps<typeof StyledMenu> &
  VariantProps<typeof menuVariance>;

export type MenuItemProps = ComponentProps<typeof StyledMenuItem> &
  VariantProps<typeof menuItemVariance>;

const MenuItem: FC<MenuItemProps> = (props) => <StyledMenuItem {...props} />;

export const Menu = Object.assign(StyledMenu, {
  Item: MenuItem,
  Title: tw(MenuItem)`menu-title`,
});
