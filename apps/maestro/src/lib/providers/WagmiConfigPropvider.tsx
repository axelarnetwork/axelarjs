import { FC, PropsWithChildren } from "react";

import { WagmiConfig } from "wagmi";

import { wagmiClient } from "~/config/wagmi";

export const WagmiConfigPropvider: FC<PropsWithChildren> = ({ children }) => {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
};
