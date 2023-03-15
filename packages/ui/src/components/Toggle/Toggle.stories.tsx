import type { Meta, StoryFn } from "@storybook/react";

import { Toggle } from "./Toggle";

export default {
  title: "components/Toggle",
  component: Toggle,
  docs: {
    description: {
      component: "Toggle, Toggle, does whatever a Toggle do.",
    },
  },
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = (args) => {
  return <Toggle {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
