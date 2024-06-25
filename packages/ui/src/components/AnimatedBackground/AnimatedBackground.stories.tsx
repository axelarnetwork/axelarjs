import type { Meta, StoryFn } from "@storybook/react";

import { AnimatedBackground } from "./AnimatedBackground";

export default {
  title: "components/AnimatedBackground",
  component: AnimatedBackground,
  docs: {
    description: {
      component:
        "AnimatedBackground, AnimatedBackground, does whatever a AnimatedBackground do.",
    },
  },
} as Meta<typeof AnimatedBackground>;

const Template: StoryFn<typeof AnimatedBackground> = (args) => {
  return <AnimatedBackground {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
