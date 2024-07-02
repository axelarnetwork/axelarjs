import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";
import { midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import wagmiConfig from "../wagmi-config";

const client = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
          <RainbowKitProvider
            modalSize="compact"
            theme={midnightTheme({
              borderRadius: "small",
              fontStack: "system",
            })}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
