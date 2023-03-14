import type { FC } from "react";

import * as RadixSwitch from "@radix-ui/react-switch";
import tw from "tailwind-styled-components";

const Root = tw(RadixSwitch.Root)`
  bg-gray-400
  w-11 h-6
  shadow-sm
  relative
  rounded-full
  focus:shadow-black
  [-webkit-tap-highlight-color:rgba(0,0,0,0)]
  radix-state-checked:bg-black
`;

const Thumb = tw(RadixSwitch.Thumb)`
  bg-white
  rounded-full
  w-5 h-5 block
  transition-transform
  will-change-transform
  translate-x-0.5
  radix-state-checked:translate-x-5
`;

export type SwitchProps = RadixSwitch.SwitchProps & {};

export const Switch: FC<SwitchProps> = (props) => {
  return (
    <Root {...props}>
      <Thumb />
    </Root>
  );
};
