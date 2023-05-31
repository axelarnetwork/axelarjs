import { pluralizeKeys } from "@axelarjs/utils";

import { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "~/theme";
import { configurePlayground } from "../StoryPlayground";
import { Toggle } from "./Toggle";

export default {
  title: "components/Toggle",
  component: Toggle,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as Meta<typeof Toggle>;

// creates stories for variansts (color, size, shape)
const { Colors, Sizes } = pluralizeKeys(
  configurePlayground(Toggle, {
    color: {
      values: COLOR_VARIANTS,
      noChildren: true,
    },
    size: {
      values: SIZE_VARIANTS,
      noChildren: true,
    },
  })
);

export { Colors, Sizes };
