import type { Meta, StoryFn } from "@storybook/react";

import { configurePlayground } from "../StoryPlayground";
import { Alert } from "./Alert";

export default {
  title: "components/Alert",
  component: Alert,
  docs: {
    description: {
      component: "Alert, Alert, does whatever a Alert do.",
    },
  },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = (args) => {
  return <Alert {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  children: "Default Alert",
};

const { Status } = configurePlayground(Alert, {
  status: {
    values: ["info", "success", "warning", "error"],
  },
});

export { Status };
