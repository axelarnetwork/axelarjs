"use client";

import { Tabs } from "@axelarjs/ui";
import type { FC, PropsWithChildren } from "react";
import Link from "next/link";

import { CHAIN_TABS } from "~/app/chains/_shared";
import Page from "~/layouts/Page";

export type PropsWithNetworkParam<T = {}> = T & {
  params: {
    network: "evm" | "cosmos";
  };
};

type Props = PropsWithNetworkParam<PropsWithChildren>;

const ChainsLayout: FC<Props> = (props) => {
  return (
    <Page className="space-y-4">
      <div className="mx-auto">
        <Tabs boxed>
          {CHAIN_TABS.map((tab) => (
            <Tabs.Tab
              active={tab.value === props.params.network}
              key={tab.value}
              $as={Link}
              href={`/chains/${tab.value}`}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>

      {props.children}
    </Page>
  );
};

export default ChainsLayout;
