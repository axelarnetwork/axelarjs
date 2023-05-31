import { pluralizeKeys } from "@axelarjs/utils";

import type { Meta, StoryFn } from "@storybook/react";

import { SIZE_VARIANTS } from "~/theme";
import { configurePlayground } from "../StoryPlayground";
import { Kbd } from "./Kbd";

export default {
  title: "components/Kbd",
  component: Kbd,
  docs: {
    description: {
      component: "Kbd, Kbd, does whatever a Kbd do.",
    },
  },
} as Meta<typeof Kbd>;

const Template: StoryFn<typeof Kbd> = (args) => {
  return <Kbd {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

const { Sizes } = pluralizeKeys(
  configurePlayground(Kbd, {
    size: { values: SIZE_VARIANTS },
  })
);

export { Sizes };
