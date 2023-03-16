import type { Meta, StoryFn } from "@storybook/react";

import { Navbar } from "./Navbar";

export default {
  title: "components/Navbar",
  component: Navbar,
  docs: {
    description: {
      component: "Navbar, Navbar, does whatever a Navbar do.",
    },
  },
} as Meta<typeof Navbar>;

const Template: StoryFn<typeof Navbar> = (args) => {
  return <Navbar {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
