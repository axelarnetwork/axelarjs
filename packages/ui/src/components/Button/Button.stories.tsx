import { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../StoryPlayground";
import { Button, ButtonProps } from "./Button";

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

const colors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "error",
  "warning",
  "info",
] as ButtonProps["color"][];

const sizes = ["xs", "sm", "md", "lg"] as ButtonProps["size"][];

const { Color, Size, Shape } = configurePlayground(Button, {
  color: colors,
  size: sizes,
  shape: ["circle", "square"],
});

export { Color, Size, Shape };
