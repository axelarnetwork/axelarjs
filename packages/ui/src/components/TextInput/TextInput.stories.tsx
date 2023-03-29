import { pluralizeKeys } from "@axelarjs/utils";
import type { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { configurePlayground } from "../StoryPlayground";
import { TextInput } from "./TextInput";

export default {
  title: "components/TextInput",
  component: TextInput,
  docs: {
    description: {
      component: "TextInput, TextInput, does whatever a TextInput do.",
    },
  },
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  placeholder: "Placeholder",
};
const { Sizes, Colors } = pluralizeKeys(
  configurePlayground(TextInput, {
    size: {
      values: SIZE_VARIANTS,
      noChildren: true,
    },
    color: {
      values: COLOR_VARIANTS,
      noChildren: true,
    },
  })
);

export { Sizes, Colors };
