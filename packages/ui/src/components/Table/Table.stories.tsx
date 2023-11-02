import type { Meta, StoryFn } from "@storybook/react";

import { Table } from "./Table";

export default {
  title: "components/Table",
  component: Table,
  docs: {
    description: {
      component: "Table, Table, does whatever a Table do.",
    },
  },
} as Meta<typeof Table>;

const Template: StoryFn<typeof Table> = (args) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
