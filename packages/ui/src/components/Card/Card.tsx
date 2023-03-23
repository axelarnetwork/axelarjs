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

type CardBaseProps = VariantProps<typeof cardVariance>;

type Props = JSX.IntrinsicElements["div"] & CardBaseProps & {};
const CardContainer = ({ bordered, className, ...props }: Props) => {
  return (
    <div
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
