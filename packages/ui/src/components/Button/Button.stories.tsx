import { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../../StoryPlayground";
import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { AxelarBlueIcon, AxelarIcon } from "../icons";
import { Button } from "./Button";

export default {
  title: "components/Button",
  component: Button,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => {
  return <Button {...args}>{args.children ?? "Button"}</Button>;
};

export const Default = Template.bind({});

export const Loading = Template.bind({});

Loading.args = {
  $loading: true,
};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
};

// creates stories for variansts (color, size, shape)
const stories = configurePlayground(Button, {
  $variant: {
    values: COLOR_VARIANTS,
  },
  $size: {
    values: SIZE_VARIANTS,
  },
  $length: {
    values: ["block", "wide"],
  },
  $shape: {
    values: ["circle", "square"],
    getChildren: (value) =>
      value === "circle" ? (
        <AxelarBlueIcon className="h-6 w-6" />
      ) : (
        <AxelarIcon className="h-6 w-6 dark:invert" />
      ),
  },
});

export const Variants = stories.$variant;
export const Sizes = stories.$size;
export const Shapes = stories.$shape;
export const Lengths = stories.$length;
