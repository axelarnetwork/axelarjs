import { pluralizeKeys } from "@axelarjs/utils";

import type { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { configurePlayground } from "../StoryPlayground";
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

const { Sizes, Variants } = pluralizeKeys(
  configurePlayground(CopyToClipboardButton, {
    variant: {
      values: COLOR_VARIANTS,
    },
    size: {
      values: SIZE_VARIANTS,
    },
  })
);

export { Sizes, Variants };
