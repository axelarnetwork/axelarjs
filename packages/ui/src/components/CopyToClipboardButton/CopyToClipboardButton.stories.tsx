import type { Meta, StoryFn } from "@storybook/react";

import { CopyToClipboardButton } from "./CopyToClipboardButton";

export default {
  title: "components/CopyToClipboardButton",
  component: CopyToClipboardButton,
  docs: {
    description: {
      component:
        "CopyToClipboardButton, CopyToClipboardButton, does whatever a CopyToClipboardButton do.",
    },
  },
} as Meta<typeof CopyToClipboardButton>;

const Template: StoryFn<typeof CopyToClipboardButton> = (args) => {
  return <CopyToClipboardButton {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
