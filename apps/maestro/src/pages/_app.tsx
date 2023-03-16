import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Cabin } from "@next/font/google";
import { AxelarIcon, Navbar, ThemeSwitcher } from "@axelarjs/ui";

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
      <div className="min-h-screen flex flex-col flex-1 gap-4">
        <Navbar className="bg-base-200">
          <Navbar.Start>
            <div className="flex items-center gap-2 text-lg font-bold uppercase">
              <AxelarIcon className="h-6 w-6 dark:invert" />
              Axelar Maestro
            </div>
          </Navbar.Start>
          <Navbar.End>
            <ThemeSwitcher />
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
