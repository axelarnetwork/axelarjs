import { pluralizeKeys } from "@axelarjs/utils";
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

// creates stories for variansts (color, size, shape)
const { Colors, Sizes, Shapes } = pluralizeKeys(
  configurePlayground(Button, {
    color: { values: colors },
    size: { values: sizes },
    shape: {
      values: ["circle", "square"],
      getChildren: (value) => (value === "circle" ? "🔵" : "🟢"),
    },
  })
);

export { Colors, Sizes, Shapes };
