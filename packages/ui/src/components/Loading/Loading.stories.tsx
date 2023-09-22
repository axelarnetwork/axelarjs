import { pluralizeKeys } from "@axelarjs/utils";

import type { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { configurePlayground } from "../StoryPlayground";
import { Loading } from "./Loading";

export default {
  title: "components/Loading",
  component: Loading,
  docs: {
    description: {
      component: "Loading, Loading, does whatever a Loading do.",
    },
  },
} as Meta<typeof Loading>;

const Template: StoryFn<typeof Loading> = (args) => {
  return <Loading {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

const { Variants, Sizes, Shapes } = pluralizeKeys(
  configurePlayground(Loading, {
    variant: {
      values: COLOR_VARIANTS,
    },
    size: {
      values: SIZE_VARIANTS,
    },
    shape: {
      values: ["spinner", "dots", "ring", "infinity", "bars", "ball"],
      getChildren: (value) => (value === "circle" ? "🔵" : "🟢"),
    },
  })
);

export { Variants, Sizes, Shapes };
