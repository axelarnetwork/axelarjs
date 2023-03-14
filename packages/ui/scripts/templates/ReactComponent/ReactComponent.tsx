import type { FC } from "react";
import tw from "tailwind-styled-components";

const StyledReactComponent = tw.div``;

export type ReactComponentProps = {};

export const ReactComponent: FC<ReactComponentProps> = (props) => {
  return <StyledReactComponent>ReactComponent</StyledReactComponent>;
};
