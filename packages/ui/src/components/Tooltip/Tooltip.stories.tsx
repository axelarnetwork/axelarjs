import type { Meta, StoryFn } from "@storybook/react";

import { Button } from "../Button";
import { PlusIcon } from "../icons/lucide";
import { Tooltip, TooltipProps } from "./Tooltip";

export default {
  title: "components/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "Tooltips are used to provide additional information to the user when they hover over an element.",
      },
    },
  },
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = (args) => (
  <div className="p-8">
    <Tooltip {...args} />
  </div>
);

const withProps = (args: TooltipProps) => {
  const Cmp = Template.bind({});
  Cmp.args = args;
  return Cmp;
};

export const Default = withProps({
  tip: "This is a tooltip",
  children: "Hover me for a tooltip",
});

export const WithClassName = withProps({
  tip: "This is a tooltip with a custom class name",
  className: "custom-class",
  children: "Hover me for a tooltip",
});

export const WithCustomPosition = withProps({
  tip: "This is a tooltip with a custom position",
  position: "bottom",
  children: "Hover me for a tooltip",
});

export const WithCustomVariant = withProps({
  tip: "This is a tooltip with a custom variant",
  variant: "accent",
  children: "Hover me for a tooltip",
});

export const WithIconAndRightPosition = withProps({
  tip: "This is a tooltip with an icon and a custom position",
  position: "right",
  children: (
    <Button size="sm">
      <PlusIcon className="h-4 w-4" />
    </Button>
  ),
});
