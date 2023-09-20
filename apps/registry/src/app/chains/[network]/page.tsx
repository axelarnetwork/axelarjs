import type { FC } from "react";

import Chains from "~/components/Chains";
import type { PropsWithNetworkParam } from "./layout";

const ChainsPage: FC<
  PropsWithNetworkParam<{
    searchParams: { [key: string]: string | string[] | undefined };
  }>
> = ({ params, searchParams }) => {
  return (
    <Chains
      network={params.network}
      search={searchParams?.search?.toString() ?? ""}
    />
  );
};

export default ChainsPage;
