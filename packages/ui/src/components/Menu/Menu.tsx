import type { ComponentProps } from "react";

import tw from "../../tw";

export type MenuProps = ComponentProps<typeof MenuRoot>;

const MenuRoot = tw.ul.cva("menu", {
  variants: {
    $direction: {
      vertical: "menu-vertical",
      horizontal: "menu-horizontal",
    },
    $size: {
      normal: "menu-normal",
      compact: "menu-compact",
    },
    $rounded: {
      true: "rounded-box",
    },
  },
});

const MenuItem = tw.li.cva("menu-item", {
  variants: {
    $active: {
      true: "active",
    },
    $bordered: {
      true: "bordered",
      hover: "hover-bordered",
    },
    $disabled: {
      true: "disabled",
    },
  },
});

export type MenuItemProps = ComponentProps<typeof MenuItem>;

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Title: tw(MenuItem)`menu-title`,
});
