import { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { Badge } from "./Badge";

export default {
  title: "components/Badge",
  component: Badge,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as Meta<typeof Badge>;

const Template: StoryFn<typeof Badge> = (args) => {
  return <Badge {...args}>{args.children ?? "Badge"}</Badge>;
};

export const Default = Template.bind({});

// creates stories for variansts (color, size, shape)
const stories = configurePlayground(Badge, {
  $variant: {
    values: COLOR_VARIANTS,
  },
  $size: {
    values: SIZE_VARIANTS,
  },
});

export const Variants = stories.$variant;
export const Sizes = stories.$size;
