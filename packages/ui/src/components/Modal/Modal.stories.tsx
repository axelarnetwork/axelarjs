import type { Meta, StoryFn } from "@storybook/react";

import { Modal } from "./Modal";

export default {
  title: "components/Modal",
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: "Modals are used for popup windows with one-off content.",
      },
    },
  },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  // @ts-ignore
  return (
    <Modal {...args}>
      <Modal.Title>Title</Modal.Title>
      <Modal.Description>Description</Modal.Description>
      <Modal.Body>
        <p>Modal body</p>
      </Modal.Body>
      <Modal.Actions>
        <Modal.CloseAction variant="error">Cancel</Modal.CloseAction>
        <Modal.CloseAction variant="primary">Confirm</Modal.CloseAction>
      </Modal.Actions>
    </Modal>
  );
};

export const Default = Template.bind({});

Default.args = {
  children: "Default Modal",
  className: "bg-base-300",
};
