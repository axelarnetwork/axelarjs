import type { NextPage } from "next";
import localFont from "next/font/local";
import Head from "next/head";

import TxCard from "../components/TxCard";

const petitinhoFont = localFont({ src: "./fonts/Petitinho.ttf" });

const Home: NextPage = () => (
  <main
    className={`${petitinhoFont.className} flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white`}
  >
    <Head>
      <title>Interchain Token Transfer</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>
    <TxCard />
  </main>
);

export default Home;
