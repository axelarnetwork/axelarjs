import type { ComponentProps, FC } from "react";

import tw from "tailwind-styled-components";

const StyledReactComponent = tw.div``;

export type ReactComponentProps = ComponentProps<
  typeof StyledReactComponent
> & {};

export const ReactComponent: FC<ReactComponentProps> = (props) => {
  return <StyledReactComponent>ReactComponent</StyledReactComponent>;
};
