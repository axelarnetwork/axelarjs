import { pluralizeKeys } from "@axelarjs/utils";

import { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { configurePlayground } from "../StoryPlayground";
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
const { Variants, Sizes } = pluralizeKeys(
  configurePlayground(Badge, {
    variant: {
      values: COLOR_VARIANTS,
    },
    size: {
      values: SIZE_VARIANTS,
    },
  })
);

export { Variants, Sizes };
