import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Cabin } from "@next/font/google";

const fontSans = Cabin({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />;
    </>
  );
}
