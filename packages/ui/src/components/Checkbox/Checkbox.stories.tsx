import { pluralizeKeys } from "@axelarjs/utils";

import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { Checkbox } from "./Checkbox";

export default {
  title: "components/Checkbox",
  component: Checkbox,
  docs: {
    description: {
      component: "Checkbox, Checkbox, does whatever a Checkbox do.",
    },
  },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => {
  return <Checkbox {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

const { InputSizes, Variants } = pluralizeKeys(
  configurePlayground(
    Checkbox,
    {
      inputSize: {
        values: SIZE_VARIANTS,
        noChildren: true,
      },
      variant: {
        values: COLOR_VARIANTS,
        noChildren: true,
      },
    },
    {
      defaultChecked: true,
    }
  )
);

export { InputSizes, Variants };
