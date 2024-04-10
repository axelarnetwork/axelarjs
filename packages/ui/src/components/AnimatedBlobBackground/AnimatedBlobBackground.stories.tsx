import type { Meta, StoryFn } from "@storybook/react";

import { AnimatedBlobBackground } from "./AnimatedBlobBackground";

export default {
  title: "components/AnimatedBlobBackground",
  component: AnimatedBlobBackground,
  docs: {
    description: {
      component:
        "AnimatedBlobBackground, AnimatedBlobBackground, does whatever a AnimatedBlobBackground do.",
    },
  },
} as Meta<typeof AnimatedBlobBackground>;

const Template: StoryFn<typeof AnimatedBlobBackground> = (args) => {
  return <AnimatedBlobBackground {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
