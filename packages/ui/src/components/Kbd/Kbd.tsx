import type { ComponentProps, FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledKbd = tw.kbd``;

const kbdVariance = cva("kbd", {
  variants: {
    size: {
      xs: "kbd-xs",
      sm: "kbd-sm",
      md: "kbd-md",
      lg: "kbd-lg",
    },
  },
});

export interface KbdProps
  extends ComponentProps<typeof StyledKbd>,
    VariantProps<typeof kbdVariance> {}

export const Kbd: FC<KbdProps> = ({ size, className, ...props }) => {
  return (
    <StyledKbd
      className={twMerge(kbdVariance({ size }), className)}
      {...props}
    />
  );
};
