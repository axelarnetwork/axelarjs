import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import tw from "../../tw";

const tableVariance = cva("table", {
  variants: {
    zebra: {
      true: "table-zebra",
    },
    pinRows: {
      true: "table-pin-rows",
    },
    pinCols: {
      true: "table-pin-cols",
    },
    size: {
      xs: "table-xs",
      sm: "table-sm",
      md: "table-md",
      lg: "table-lg",
    },
  },
});

const StyledTable = tw.table``;

type TableBaseProps = VariantProps<typeof tableVariance>;

export interface TableProps
  extends ComponentProps<typeof StyledTable>,
    TableBaseProps {}

const TableRoot = ({
  zebra,
  pinRows,
  pinCols,
  size,
  className,
  ...props
}: TableProps) => {
  return (
    <StyledTable
      className={twMerge(
        tableVariance({ zebra, pinRows, pinCols, size }),
        className
      )}
      {...props}
    />
  );
};

export const Table = Object.assign(TableRoot, {
  Head: tw.thead``,
  Column: tw.th``,
  Body: tw.tbody``,
  Row: tw.tr``,
  Cell: tw.td``,
});
