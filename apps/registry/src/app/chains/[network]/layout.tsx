"use client";

import { Tabs, TextInput } from "@axelarjs/ui";
import { debounce } from "@axelarjs/utils";
import {
  ChangeEvent,
  useCallback,
  type FC,
  type PropsWithChildren,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CHAIN_TABS } from "~/app/chains/_shared";
import Page from "~/layouts/Page";

export type PropsWithNetworkParam<T = {}> = T & {
  params: {
    network: "evm" | "cosmos";
  };
};

type Props = PropsWithNetworkParam<PropsWithChildren>;

const ChainsLayout: FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSeachChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const queryString = createQueryString("search", value);
    router.push(`${pathname}?${queryString}`);
  }, 150);

  return (
    <Page className="space-y-4">
      <div className="bg-base-300 mx-auto flex items-center gap-2 rounded-2xl p-1.5">
        <div>
          <TextInput
            inputSize="sm"
            placeholder="Search chain"
            type="search"
            className="h-9"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={handleSeachChange}
          />
        </div>
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
