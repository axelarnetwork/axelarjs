import type { NextPage } from "next";
import localFont from "next/font/local";
import Head from "next/head";

import Starfield from "../components/animations/StarsBackground";
import TxCard from "../components/TxCard";

const petitinhoFont = localFont({ src: "./fonts/Petitinho.ttf" });

const Home: NextPage = () => (
  <main
    className={`${petitinhoFont.className} flex min-h-screen flex-col items-center justify-center bg-black text-white`}
  >
    <Head>
      <title>Interchain Token Transfer</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>
    <Starfield
      starCount={1000}
      starColor={[255, 255, 255]}
      speedFactor={0.05}
      backgroundColor="black"
    />
    <TxCard />
  </main>
);

export default Home;
