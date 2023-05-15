import { FC, PropsWithChildren } from "react";

import { WagmiConfig } from "wagmi";

import { wagmiConfig } from "~/config/wagmi";

export const WagmiConfigPropvider: FC<PropsWithChildren> = ({ children }) => {
  if (!wagmiConfig) {
    return <>{children}</>;
  }
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
