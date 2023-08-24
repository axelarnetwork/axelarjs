import { FC } from "react";

import Chains from "~/components/Chains";
import type { PropsWithNetworkParam } from "./layout";

const ChainsPage: FC<PropsWithNetworkParam> = ({ params }) => {
  return <Chains network={params.network} />;
};

export default ChainsPage;
