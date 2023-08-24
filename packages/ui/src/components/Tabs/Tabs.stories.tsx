import { MouseEventHandler, useState } from "react";

import type { Meta, StoryFn } from "@storybook/react";

import { Tabs } from "./Tabs";

export default {
  title: "components/Tabs",
  component: Tabs,
  docs: {
    description: {
      component: "Tabs, Tabs, does whatever a Tabs do.",
    },
  },
} as Meta<typeof Tabs>;

const TABS = [
  {
    label: "Mainnet",
    value: "mainnet",
  },
  {
    label: "Testnet",
    value: "testnet",
  },
];

const Template: StoryFn<typeof Tabs> = (args) => {
  const [selectedTab, selectTab] = useState(TABS[0].value);

  const handleTabChange =
    (tab: string): MouseEventHandler =>
    (event) => {
      event.preventDefault();

      selectTab(tab);
    };

  return (
    <div>
      <Tabs {...args}>
        {TABS.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            active={tab.value === selectedTab}
            href="#"
            onClick={handleTabChange(tab.value)}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <div className="p-4">selected tab: {selectedTab}</div>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {};

export const Boxed = Template.bind({});

Boxed.args = {
  boxed: true,
};
