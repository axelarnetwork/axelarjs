import { ReactNode } from "react";

import type { Meta, StoryFn } from "@storybook/react";

import { Dropdown, DropdownProps } from "./Dropdown";

export default {
  title: "components/Dropdown",
  component: Dropdown,
  docs: {
    description: {
      component: "Dropdown, Dropdown, does whatever a Dropdown do.",
    },
  },
} as Meta<typeof Dropdown>;

type StoryArgs = DropdownProps & {
  trigger: ReactNode;
  items: string[] | ReactNode[];
};

const Template: StoryFn<StoryArgs> = (args: StoryArgs) => {
  if (args.items) {
    return (
      <Dropdown {...args}>
        {args.trigger}
        <Dropdown.Content>
          {args.items.map((item, i) => (
            <Dropdown.Item key={`item-${i}`}>{item}</Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    );
  }
  return <Dropdown {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  trigger: <Dropdown.Trigger>Dropdown</Dropdown.Trigger>,
  items: ["Item 1", "Item 2", "Item 3"],
};
