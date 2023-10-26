import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";

import tw from "../../tw";
import { cn } from "../../utils";

const StyledTabs = tw.div`tabs`;
const StyledTab = tw.a`tab`;

StyledTab.defaultProps = {
  href: "#",
};

export const tabsVariance = cva("tabs", {
  variants: {
    boxed: {
      true: "tabs-boxed",
    },
  },
});

export const tabVariance = cva("tab", {
  variants: {
    active: {
      true: "tab-active",
    },
    bordered: {
      true: "tab-bordered",
    },
    disabled: {
      true: "tab-disabled",
    },
  },
});

export interface TabsProps
  extends ComponentProps<typeof StyledTabs>,
    VariantProps<typeof tabsVariance> {}

const TabsRoot: FC<TabsProps> = ({ boxed, className, ...props }) => (
  <StyledTabs className={cn(tabsVariance({ boxed }), className)} {...props} />
);

export interface TabProps
  extends ComponentProps<typeof StyledTab>,
    VariantProps<typeof tabVariance> {}

const Tab: FC<TabProps> = ({
  active,
  bordered,
  disabled,
  className,
  ...props
}) => (
  <StyledTab
    className={cn(tabVariance({ active, bordered, disabled }), className)}
    {...props}
  />
);

export const Tabs = Object.assign(TabsRoot, {
  Tab,
});
