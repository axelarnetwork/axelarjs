import { ComponentProps, FC } from "react";

import tw from "../../tw";

export const Clamp = tw.div`
  max-w-4xl 
  w-full
  mx-auto
`;

export const FormControl = tw.div`form-control`;

const StyledLabel = tw.label`label`;

export interface LabelProps extends ComponentProps<typeof StyledLabel> {}

const BaseLabel: FC<LabelProps> = ({ children, ...props }) => {
  return (
    <StyledLabel {...props}>
      {typeof children === "string" ? (
        <Label.Text>{children}</Label.Text>
      ) : (
        children
      )}
    </StyledLabel>
  );
};

export const Label = Object.assign(BaseLabel, {
  Text: tw.span`label-text`,
  AltText: tw.span`label-text-alt`,
});
