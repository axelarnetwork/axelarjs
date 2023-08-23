import type { FC } from "react";

import Chains from "~/components/Chains";
import ChainsLayout from "./[network]/layout";

const DEFAULT_NETWORK = "evm";

const Home: FC = () => {
  return (
    <ChainsLayout params={{ network: DEFAULT_NETWORK }}>
      <Chains network={DEFAULT_NETWORK} />
    </ChainsLayout>
  );
};

export default Home;
