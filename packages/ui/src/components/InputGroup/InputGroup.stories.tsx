import type { Meta, StoryFn } from "@storybook/react";

import { InputGroup } from "./InputGroup";

export default {
  title: "components/InputGroup",
  component: InputGroup,
  docs: {
    description: {
      component: "InputGroup, InputGroup, does whatever a InputGroup do.",
    },
  },
} as Meta<typeof InputGroup>;

const Template: StoryFn<typeof InputGroup> = (args) => {
  return <InputGroup {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
