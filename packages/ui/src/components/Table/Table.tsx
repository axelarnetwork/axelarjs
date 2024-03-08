import type { ComponentProps } from "react";

import tw from "../../tw";

const StyledTable = tw.table.cva("table", {
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

export type TableProps = ComponentProps<typeof StyledTable>;

export const Table = Object.assign(StyledTable, {
  Head: tw.thead``,
  Column: tw.th``,
  Body: tw.tbody``,
  Row: tw.tr``,
  Cell: tw.td``,
});
