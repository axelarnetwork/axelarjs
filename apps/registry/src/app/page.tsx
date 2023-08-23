"use client";

import { cn, Menu, Tabs } from "@axelarjs/ui";
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
  return (
    <Page className="space-y-4">
      <Menu>
        <Menu.Item>
          <a href="/chains/evm">EVM Chains</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/chains/cosmos">Cosmos Chains</a>
        </Menu.Item>
      </Menu>
    </Page>
  );
}
