"use client";

import { cn, Tabs } from "@axelarjs/ui";
import { FC, MouseEventHandler, useState } from "react";

import Chains from "~/components/Chains";
import Page from "~/layouts/Page";

const TABS = [
  {
    label: "EVM Chains",
    value: "evm-chains",
  },
  {
    label: "Cosmos Chains",
    value: "cosmos-chains",
  },
];

export default function Home() {
  const [selectedTab, selectTab] = useState(TABS[0].value);

  const handleTabChange =
    (tab: string): MouseEventHandler =>
    (event) => {
      event.preventDefault();
      selectTab(tab);
    };

  return (
    <Page className="space-y-4">
      <Tabs boxed>
        {TABS.map((tab) => (
          <Tabs.Tab
            className={cn("tab", {
              "tab-active": tab.value === selectedTab,
            })}
            key={tab.value}
            href="#"
            onClick={handleTabChange(tab.value)}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>

      <div className="">
        {selectedTab === "evm-chains" && <Chains network="evm" />}
        {selectedTab === "cosmos-chains" && <Chains network="cosmos" />}
      </div>
    </Page>
  );
}
