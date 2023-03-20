import { pluralizeKeys } from "@axelarjs/utils";
import type { Meta, StoryFn } from "@storybook/react";

import { buttonColors, buttonSizes } from "../Button/Button.stories";
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

const { Sizes, Colors } = pluralizeKeys(
  configurePlayground(CopyToClipboardButton, {
    size: {
      values: buttonSizes,
    },
    color: {
      values: buttonColors,
    },
  })
);

export { Sizes, Colors };
