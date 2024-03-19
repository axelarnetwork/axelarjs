import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS } from "../../theme";
import { Progress } from "./Progress";

export default {
  title: "components/Progress",
  component: Progress,
  docs: {
    description: {
      component: "Progress, Progress, does whatever a Progress do.",
    },
  },
} as Meta<typeof Progress>;

const Template: StoryFn<typeof Progress> = (args) => {
  return <Progress {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

const stories = configurePlayground(Progress, {
  $variant: {
    values: COLOR_VARIANTS,
    noChildren: true,
  },
});

export const Variants = stories.$variant;
