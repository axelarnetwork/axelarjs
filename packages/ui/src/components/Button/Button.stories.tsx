import { pluralizeKeys } from "@axelarjs/utils";
import { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../StoryPlayground";
import { Button, buttonColors, buttonSizes } from "./Button";

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

// creates stories for variansts (color, size, shape)
const { Colors, Sizes, Shapes } = pluralizeKeys(
  configurePlayground(Button, {
    color: { values: buttonColors },
    size: { values: buttonSizes },
    shape: {
      values: ["circle", "square"],
      getChildren: (value) => (value === "circle" ? "🔵" : "🟢"),
    },
  })
);

export { Colors, Sizes, Shapes };
