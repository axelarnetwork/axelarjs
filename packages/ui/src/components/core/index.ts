import tw from "tailwind-styled-components";

export const Clamp = tw.div`
  max-w-4xl 
  w-full
  mx-auto
`;

export const FormControl = tw.div`form-control`;

export const Label = Object.assign(tw.label`label`, {
  Text: tw.span`label-text`,
  AltText: tw.span`label-text-alt`,
});
