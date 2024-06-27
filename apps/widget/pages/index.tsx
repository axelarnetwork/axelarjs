import type { NextPage } from "next";
import localFont from "next/font/local";
import Head from "next/head";

import TxCard from "../components/TxCard";

const clashGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/ClashGrotesk-Extralight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashGrotesk-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-grotesk",
});

const Home: NextPage = () => (
  <main
    className={`${clashGrotesk.className} bg-secondary flex min-h-screen flex-col items-center justify-center text-white`}
  >
    <Head>
      <title>Interchain Token Transfer</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>
    <TxCard />
  </main>
);

export default Home;
