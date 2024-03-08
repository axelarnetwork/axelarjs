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

Default.args = {
  children: (
    <>
      <Menu.Title>Menu Title</Menu.Title>
      <Menu.Item>
        <a>Item 1</a>
      </Menu.Item>
      <Menu.Item>
        <a>Item 2</a>
      </Menu.Item>
      <Menu.Item>
        <a>Item 3</a>
      </Menu.Item>
    </>
  ),
};
