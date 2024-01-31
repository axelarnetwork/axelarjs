import type { Meta, StoryFn } from "@storybook/react";

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
