import { FC } from "react";

import Chains from "~/components/Chains";
import type { ChainsLayoutProps } from "./layout";

const ChainsPage: FC<ChainsLayoutProps> = (props) => {
  return <Chains network={props.params.network} />;
};

export default ChainsPage;
