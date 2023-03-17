import tw from "tailwind-styled-components";

const CardContainer = tw.div`card`;

export const Card = Object.assign(CardContainer, {
  Title: tw.div`card-title`,
  Body: tw.div`card-body`,
});
