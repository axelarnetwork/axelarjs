import clsx from "clsx";
import tw from "tailwind-styled-components";

type ElementKind = keyof JSX.IntrinsicElements;

export type CardProps<T extends ElementKind> = JSX.IntrinsicElements[T] & {
  className?: string;
  as?: ElementKind;
};

const CardContainer = <T extends ElementKind = "div">(props: CardProps<T>) => {
  const Tag = props.as ?? "div";

  return <Tag className={clsx("card", props.className)}>{props.children}</Tag>;
};

export const Card = Object.assign(CardContainer, {
  Title: tw.div`card-title`,
  Body: tw.div`card-body`,
});
