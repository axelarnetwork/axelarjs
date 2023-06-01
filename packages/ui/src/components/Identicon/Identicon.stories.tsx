import type { Meta, StoryFn } from "@storybook/react";

import { Identicon } from "./Identicon";

export default {
  title: "components/Identicon",
  component: Identicon,
  docs: {
    description: {
      component: "Identicon, Identicon, does whatever a Identicon do.",
    },
  },
} as Meta<typeof Identicon>;

const Template: StoryFn<typeof Identicon> = (args) => {
  return <Identicon {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
