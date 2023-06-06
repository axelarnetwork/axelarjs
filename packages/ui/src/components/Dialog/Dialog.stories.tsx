import type { Meta, StoryFn } from "@storybook/react";

import { Button } from "../Button";
import { Dialog } from "./Dialog";

export default {
  title: "components/Dialog",
  component: Dialog,
  docs: {
    description: {
      component: "Dialog, Dialog, does whatever a Dialog do.",
    },
  },
} as Meta<typeof Dialog>;

const Template: StoryFn<typeof Dialog> = (args) => {
  return <Dialog {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  renderTrigger: (props) => <Button {...props}>Open Dialog</Button>,
  children: (
    <Dialog.Body>
      <Dialog.CornerCloseAction />
      <Dialog.Title>Dialog Title</Dialog.Title>
      <p className="py-4">Press ESC key or click the button below to close</p>
      <Dialog.Actions>
        {/* if there is a button in Dialog.Body, it will close the modal */}
        <Button type="submit">Close</Button>
      </Dialog.Actions>
    </Dialog.Body>
  ),
};
