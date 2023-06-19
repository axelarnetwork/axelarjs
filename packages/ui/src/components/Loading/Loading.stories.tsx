import type { Meta, StoryFn } from "@storybook/react";

import { Loading } from "./Loading";

export default {
  title: "components/Loading",
  component: Loading,
  docs: {
    description: {
      component: "Loading, Loading, does whatever a Loading do.",
    },
  },
} as Meta<typeof Loading>;

const Template: StoryFn<typeof Loading> = (args) => {
  return <Loading {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
