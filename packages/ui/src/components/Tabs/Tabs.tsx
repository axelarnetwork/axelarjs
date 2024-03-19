import type { ComponentProps } from "react";

import tw from "../../tw";

const StyledTabs = tw.div.cva("tabs", {
  variants: {
    $boxed: {
      true: "tabs-boxed",
    },
  },
});

export type TabsProps = ComponentProps<typeof StyledTabs>;

export type TabProps = ComponentProps<typeof StyledTab>;

const StyledTab = tw.a.cva("tab", {
  variants: {
    $bordered: {
      true: "tab-bordered",
    },
    active: {
      true: "tab-active",
    },
    disabled: {
      true: "tab-disabled",
    },
  },
});

StyledTab.defaultProps = {
  href: "#",
};

export const Tabs = Object.assign(StyledTabs, {
  Tab: StyledTab,
});
