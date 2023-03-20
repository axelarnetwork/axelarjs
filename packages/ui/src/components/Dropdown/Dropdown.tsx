import type { FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import tw from "tailwind-styled-components";

import { Button } from "../Button";
import { Card } from "../Card";

const dropdownVariance = cva("dropdown", {
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

type VProps = VariantProps<typeof dropdownVariance>;

type VariableProps =
  | {
      $as?: "a";
      href?: string;
    }
  | { $as: never };

export type DropdownProps = JSX.IntrinsicElements["div"] &
  VProps &
  VariableProps;

const _Dropdown: FC<DropdownProps> = ({
  className,
  placement,
  align,
  hover,
  children,
}) => {
  return (
    <div
      className={dropdownVariance({
        placement,
        align,
        hover,
        className,
      })}
    >
      {children}
    </div>
  );
};

export const Dropdown = Object.assign(_Dropdown, {
  Trigger: tw(Button)``,
  Content: tw.ul`dropdown-content menu p-2 shadow bg-base-100 rounded-box whitespace-nowrap`,
  Item: tw.li``,
  CardContent: tw(Card)`dropdown-content`,
});
