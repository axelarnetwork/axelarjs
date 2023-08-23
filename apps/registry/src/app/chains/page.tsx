"use client";

import { Tabs } from "@axelarjs/ui";
import type { FC } from "react";
import Link from "next/link";

import Chains from "~/components/Chains";
import Page from "~/layouts/Page";
import { CHAIN_TABS } from "./_shared";

const Home: FC = () => {
  return (
    <Page className="space-y-4">
      <Tabs boxed>
        {CHAIN_TABS.map((tab) => (
          <Tabs.Tab
            active={tab.value === "evm"}
            key={tab.value}
            $as={Link}
            href={`/chains/${tab.value}`}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>

      <Chains network="evm" />
    </Page>
  );
};

export default Home;
