import { pluralizeKeys } from "@axelarjs/utils";
import { Meta, StoryFn } from "@storybook/react";

import { COLOR_VARIANTS, SIZE_VARIANTS } from "../../theme";
import { configurePlayground } from "../StoryPlayground";
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

// creates stories for variansts (color, size, shape)
const { Colors, Sizes, Shapes } = pluralizeKeys(
  configurePlayground(Button, {
    color: { values: COLOR_VARIANTS },
    size: { values: SIZE_VARIANTS },
    shape: {
      values: ["circle", "square"],
      getChildren: (value) => (value === "circle" ? "🔵" : "🟢"),
    },
  })
);

export { Colors, Sizes, Shapes };
