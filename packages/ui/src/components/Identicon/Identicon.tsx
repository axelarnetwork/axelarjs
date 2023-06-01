import type { FC } from "react";
import Jazzicon from "react-jazzicon";

export type IdenticonProps = {
  diameter: number;
  address: string;
};

export const Identicon: FC<IdenticonProps> = (props) => (
  <Jazzicon diameter={props.diameter} seed={parseInt(props.address, 32)} />
);
