import type { Meta, StoryFn } from "@storybook/react";

import { Indicator } from "./Indicator";

export default {
  title: "components/Indicator",
  component: Indicator,
  docs: {
    description: {
      component: "Indicator, Indicator, does whatever a Indicator do.",
    },
  },
} as Meta<typeof Indicator>;

const Template: StoryFn<typeof Indicator> = (args) => {
  return <Indicator {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
