import type { Meta, StoryFn } from "@storybook/react";

import { Switch } from "./Switch";

export default {
  title: "components/Switch",
  component: Switch,
  docs: {
    description: {
      component: "Switch, Switch, does whatever a Switch do.",
    },
  },
} as Meta<typeof Switch>;

type StoryArgs = React.ComponentProps<typeof Switch> & {
  label: string;
};

const Template: StoryFn<StoryArgs> = (args) => {
  if (args.label) {
    return (
      <label className="flex items-center gap-1">
        {args.label}
        <Switch {...args} />
      </label>
    );
  }
  return <Switch {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: "Switch",
};
