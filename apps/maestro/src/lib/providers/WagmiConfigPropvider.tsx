import type { FC, PropsWithChildren } from "react";

import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "~/config/wagmi";

export const WagmiConfigPropvider: FC<PropsWithChildren> = ({ children }) => {
  if (!wagmiConfig) {
    return <>{children}</>;
  }
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
