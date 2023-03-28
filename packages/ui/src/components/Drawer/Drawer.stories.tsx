import type { Meta, StoryFn } from "@storybook/react";

import { Drawer } from "./Drawer";

export default {
  title: "components/Drawer",
  component: Drawer,
  docs: {
    description: {
      component: "Drawer, Drawer, does whatever a Drawer do.",
    },
  },
} as Meta<typeof Drawer>;

const Template: StoryFn<typeof Drawer> = (args) => {
  return <Drawer {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
