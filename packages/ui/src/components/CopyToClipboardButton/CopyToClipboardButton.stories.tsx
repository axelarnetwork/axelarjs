import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
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

Default.args = {
  copyText: "Copy me!",
};

const stories = configurePlayground(CopyToClipboardButton, {
  $variant: {
    values: COLOR_VARIANTS,
  },
  $size: {
    values: SIZE_VARIANTS,
  },
});

export const Variants = stories.$variant;
export const Sizes = stories.$size;
