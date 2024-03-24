import type { ComponentProps } from "react";

import tw from "../../tw";

const StyledFooter = tw.footer.cva("footer", {
  variants: {
    $center: {
      true: "footer-center",
    },
  },
});

export type FooterProps = ComponentProps<typeof StyledFooter>;

export const Footer = Object.assign(StyledFooter, {
  Title: tw.div`footer-title`,
});
