"use client";

import { Menu } from "@axelarjs/ui";

import Page from "~/layouts/Page";

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
