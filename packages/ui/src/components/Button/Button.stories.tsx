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

const Template: StoryFn<StoryArgs> = (args) => {
  if (args.colors) {
    return (
      <Row>
        {args.colors.map((color) => (
          <Button key={color} {...args} color={color}>
            {color}
          </Button>
        ))}
      </Row>
    );
  }

  if (args.sizes) {
    return (
      <Row>
        {args.sizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </Row>
    );
  }

  if (args.shapes) {
    return (
      <div className="flex items-center gap-2">
        {args.shapes.map((shape) => (
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
