import { pluralizeKeys } from "@axelarjs/utils";

import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { Radio } from "./Radio";

export default {
  title: "components/Radio",
  component: Radio,
  docs: {
    description: {
      component: "Radio, Radio, does whatever a Radio do.",
    },
  },
} as Meta<typeof Radio>;

const Template: StoryFn<typeof Radio> = (args) => {
  return <Radio {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

const { InputSizes, Variants } = pluralizeKeys(
  configurePlayground(
    Radio,
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
