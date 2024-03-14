import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
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

const stories = configurePlayground(Loading, {
  $variant: {
    values: COLOR_VARIANTS,
  },
  $size: {
    values: SIZE_VARIANTS,
  },
  $shape: {
    values: ["spinner", "dots", "ring", "infinity", "bars", "ball"],
    getChildren: (value) => (value === "circle" ? "🔵" : "🟢"),
  },
});

export const Variants = stories.$variant;
export const Sizes = stories.$size;
export const Shapes = stories.$shape;
