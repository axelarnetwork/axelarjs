import type { FC } from "react";

import { cva, VariantProps } from "class-variance-authority";
import tw from "tailwind-styled-components";

const footerVariants = cva("footer", {
  variants: {
    center: {
      true: "footer-center",
    },
  },
});

type VProps = VariantProps<typeof footerVariants>;

export type FooterProps = JSX.IntrinsicElements["div"] & VProps & {};

const BaseFooter: FC<FooterProps> = ({ className, center, ...props }) => (
  <footer className={footerVariants({ center, className })} {...props} />
);

export const Footer = Object.assign(tw(BaseFooter)``, {
  Title: tw.div`footer-title`,
});
