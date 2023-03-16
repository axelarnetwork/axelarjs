import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Cabin } from "@next/font/google";
import { AxelarIcon, Navbar } from "@axelarjs/ui";
import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const fontSans = Cabin({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <div className="min-h-screen flex flex-col flex-1 gap-4">
        <Navbar className="bg-base-200 p-4">
          <Navbar.Start>
            <div className="flex items-center gap-2 text-lg font-bold uppercase">
              <AxelarIcon className="h-6 w-6 dark:invert" />
              Axelar Maestro
            </div>
          </Navbar.Start>
          <Navbar.End>
            <button
              className={clsx("swap swap-rotate", {
                "swap-active": theme === "light",
              })}
              onClick={() =>
                setTheme((theme) => (theme === "light" ? "dark" : "light"))
              }
            >
              <span className="swap-on">
                <SunIcon className="h-6 w-6" />
              </span>
              <span className="swap-off">
                <MoonIcon className="h-6 w-6" />
              </span>
            </button>
          </Navbar.End>
        </Navbar>
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <footer className="bg-base-200 p-4 grid place-items-center">
          <span>
            &copy;{new Date().getFullYear()} &middot; Powered by AxelarUI
          </span>
        </footer>
      </div>
    </>
  );
}
