import type { Meta, StoryFn } from "@storybook/react";

import { DropdownMenu } from "./DropdownMenu";

export default {
  title: "components/DropdownMenu",
  component: DropdownMenu,
  docs: {
    description: {
      component: "DropdownMenu, DropdownMenu, does whatever a DropdownMenu do.",
    },
  },
} as Meta<typeof DropdownMenu>;

const Template: StoryFn<typeof DropdownMenu> = (args) => {
  return <DropdownMenu {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  children: (
    <>
      <DropdownMenu.Trigger variant="primary">
        Open Dropdown
      </DropdownMenu.Trigger>
      <DropdownMenu.Content rounded className="bg-base-200 w-56 p-2">
        <DropdownMenu.Item>
          <span>Item 1</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <span>Item 2</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <span>Item 3</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </>
  ),
};
