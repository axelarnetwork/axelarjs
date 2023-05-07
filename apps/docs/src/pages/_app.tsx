import "../styles/globals.css";

import { AppProps } from "next/app";

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
