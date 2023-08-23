import type { FC } from "react";

import ChainsLayout from "./layout";

const DEFAULT_NETWORK = "evm";

const ChainsLoading: FC = () => {
  return (
    <ChainsLayout params={{ network: DEFAULT_NETWORK }}>
      loading...
    </ChainsLayout>
  );
};

export default ChainsLoading;
