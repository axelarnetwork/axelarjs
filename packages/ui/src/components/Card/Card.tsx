import { ComponentProps } from "react";

import tw from "../../tw";

const CardContainer = tw.div.cva("card", {
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

type CardBaseProps = ComponentProps<typeof CardContainer>;

export interface CardProps extends CardBaseProps {}

export const Card = Object.assign(CardContainer, {
  Title: tw.div`card-title`,
  Body: tw.div`card-body`,
  Actions: tw.div`card-actions`,
  Side: tw.div`card-side`,
});
