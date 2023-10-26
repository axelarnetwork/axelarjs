import type { Meta, StoryFn } from "@storybook/react";

import { Card } from "./Card";

export default {
  title: "components/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "Cards are used to display content in a consistent and organized way. They can be used to display text, images, and other types of content.",
      },
    },
  },
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    {typeof args.children === "string" ? (
      <Card.Body>{args.children}</Card.Body>
    ) : (
      args.children
    )}
  </Card>
);

export const Default = Template.bind({});
Default.args = {
  children: "Default Card",
  className: "bg-base-300",
};

export const CardWithTitle = Template.bind({});
CardWithTitle.args = {
  children: (
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <p>Card Body</p>
    </Card.Body>
  ),
  className: "bg-base-300",
};

export const CardWithCustomClasses = Template.bind({});
CardWithCustomClasses.args = {
  children: "Card with Custom Classes",
  className: "bg-base-300",
};

export const CardWithCustomTag = Template.bind({});
CardWithCustomTag.args = {
  children: "Card with Custom Tag",
  className: "bg-base-300",
  $as: "section",
};
