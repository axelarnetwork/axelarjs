import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const cardVariance = cva("card", {
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

const StyledCard = tw.div``;

type CardBaseProps = VariantProps<typeof cardVariance>;

export type CardProps = ComponentProps<typeof StyledCard> & CardBaseProps & {};

const CardContainer = ({ bordered, className, ...props }: CardProps) => {
  return (
    <StyledCard
      className={twMerge(cardVariance({ bordered }), className, "card")}
      {...props}
    />
  );
};

export const Card = Object.assign(CardContainer, {
  Title: tw.div`card-title`,
  Body: tw.div`card-body`,
  Actions: tw.div`card-actions`,
  Side: tw.div`card-side`,
});
