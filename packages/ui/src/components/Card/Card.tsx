import { ComponentProps } from "react";

import tw from "../../tw";

const StyledCard = tw.div.cva("card", {
  variants: {
    bordered: {
      true: "card-bordered",
    },
    compact: {
      true: "card-compact",
    },
    normal: {
      true: "card-normal",
    },
  },
});

export type CardProps = ComponentProps<typeof StyledCard>;

export const Card = Object.assign(StyledCard, {
  Title: tw.div`card-title`,
  Body: tw.div`card-body`,
  Actions: tw.div`card-actions`,
  Side: tw.div`card-side`,
});
