import type { Meta, StoryFn } from "@storybook/react";

import { TestCompound } from "./TestCompound";

export default {
  title: "components/TestCompound",
  component: TestCompound,
  docs: {
    description: {
      component: "TestCompound, TestCompound, does whatever a TestCompound do.",
    },
  },
} as Meta<typeof TestCompound>;

const Template: StoryFn<typeof TestCompound> = (args) => {
  return <TestCompound {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
