import type { ComponentProps } from "react";

import tw from "../../tw";

const StyledDropdown = tw.div.cva("dropdown", {
  variants: {
    placement: {
      top: "dropdown-top",
      bottom: "dropdown-bottom",
      left: "dropdown-left",
      right: "dropdown-right",
    },
    align: {
      end: "dropdown-end",
    },
    hover: {
      true: "dropdown-hover",
    },
  },
});

export type DropdownProps = ComponentProps<typeof StyledDropdown>;

export const Dropdown = Object.assign(StyledDropdown, {
  Trigger: tw.label`cursor-pointer`,
  Content: tw.ul`dropdown-content menu p-2 shadow bg-base-100 rounded-box whitespace-nowrap`,
  Item: tw.li``,
});

Dropdown.Trigger.defaultProps = {
  tabIndex: -1,
  role: "button",
};
