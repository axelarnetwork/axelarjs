import type { Meta, StoryFn } from "@storybook/react";

import { ThemeSwitcher } from "./ThemeSwitcher";

export default {
  title: "components/ThemeSwitcher",
  component: ThemeSwitcher,
  docs: {
    description: {
      component:
        "ThemeSwitcher, ThemeSwitcher, does whatever a ThemeSwitcher do.",
    },
  },
} as Meta<typeof ThemeSwitcher>;

const Template: StoryFn<typeof ThemeSwitcher> = (args) => {
  return <ThemeSwitcher {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
