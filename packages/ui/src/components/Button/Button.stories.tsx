import { Meta, StoryFn } from "@storybook/react";
import { XIcon } from "lucide-react";
import tw from "tailwind-styled-components";

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

type StoryArgs = ButtonProps & {
  colors: ButtonProps["color"][];
  sizes: ButtonProps["size"][];
  shapes: ButtonProps["shape"][];
};

const Row = tw.div`
  flex items-center flex-wrap gap-2
`;

const Template: StoryFn<StoryArgs> = ({
  colors,
  sizes,
  shapes,
  ref,
  onCopy,
  ...args
}: StoryArgs) => {
  if (colors) {
    return (
      <Row>
        {colors.map((color) => (
          <Button key={color} color={color} {...args}>
            {color}
          </Button>
        ))}
      </Row>
    );
  }

  if (sizes) {
    return (
      <Row>
        {sizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </Row>
    );
  }

  if (shapes) {
    return (
      <div className="flex items-center gap-2">
        {shapes.map((shape) => (
          <Button key={shape} {...args} shape={shape}>
            <XIcon />
          </Button>
        ))}
      </div>
    );
  }

  return <Button {...args}>{args.children ?? "Button"}</Button>;
};

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

export const Default = Template.bind({});

export const Colors = Template.bind({});
Colors.args = {
  colors,
};

export const Outline = Template.bind({});
Outline.args = {
  colors,
  outline: true,
};

export const Sizes = Template.bind({});
Sizes.args = {
  sizes,
};

export const Shapes = Template.bind({});
Shapes.args = {
  shapes: ["square", "circle"],
};

export const Ghost = Template.bind({});
Ghost.args = {
  ghost: true,
};

export const Loading = Template.bind({});
Loading.args = {
  colors,
  loading: true,
};

export const Glass = Template.bind({});
Glass.args = {
  colors,
  glass: true,
};

export const Link = Template.bind({});
Link.args = {
  link: true,
};
