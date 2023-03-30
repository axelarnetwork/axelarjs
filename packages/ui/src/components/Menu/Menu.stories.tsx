import type { Meta, StoryFn } from "@storybook/react";

import { Menu } from "./Menu";

export default {
  title: "components/Menu",
  component: Menu,
  docs: {
    description: {
      component: "Menu, Menu, does whatever a Menu do.",
    },
  },
} as Meta<typeof Menu>;

const Template: StoryFn<typeof Menu> = (args) => {
  return <Menu {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
