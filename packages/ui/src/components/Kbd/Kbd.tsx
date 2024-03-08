import type { ComponentProps } from "react";

import tw from "../../tw";

export const Kbd = tw.kbd.cva("kbd", {
  variants: {
    size: {
      xs: "kbd-xs",
      sm: "kbd-sm",
      md: "kbd-md",
      lg: "kbd-lg",
    },
  },
});

export type KbdProps = ComponentProps<typeof Kbd>;
