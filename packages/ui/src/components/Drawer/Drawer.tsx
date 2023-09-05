import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const drawerVariance = cva("drawer", {
  variants: {
    end: {
      true: "drawer-end",
    },
    open: {
      true: "drawer-open",
    },
    mobile: {
      true: "drawer-mobile",
    },
  },
});

const StyledDrawer = tw.div``;

type VPRops = VariantProps<typeof drawerVariance>;

export interface DrawerProps
  extends ComponentProps<typeof StyledDrawer>,
    VPRops {
  open?: boolean;
}

const DrawerRoot: FC<DrawerProps> = ({ end, mobile, className, ...props }) => {
  return (
    <StyledDrawer
      className={twMerge(
        drawerVariance({
          end,
          mobile,
        }),
        className
      )}
      {...props}
    />
  );
};

export const Drawer = Object.assign(DrawerRoot, {
  Toggle: tw.input`drawer-toggle`,
  Content: tw.div`drawer-content`,
  Side: tw.section`drawer-side`,
  Overlay: tw.div`drawer-overlay`,
});

Drawer.Toggle.defaultProps = {
  type: "checkbox",
  readOnly: true,
};
