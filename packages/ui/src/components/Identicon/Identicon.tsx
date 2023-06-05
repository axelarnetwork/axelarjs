import type { FC } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export type IdenticonProps = {
  diameter: number;
  address: string;
};

export const Identicon: FC<IdenticonProps> = (props) => (
  <Jazzicon
    diameter={props.diameter}
    seed={jsNumberForAddress(props.address)}
  />
);
