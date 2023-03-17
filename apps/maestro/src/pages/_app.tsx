import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Cabin } from "@next/font/google";
import { AxelarIcon, Clamp, Footer, Navbar, ThemeSwitcher } from "@axelarjs/ui";
import NextNProgress from "nextjs-progressbar";

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
      <NextNProgress />
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
        <Clamp $as="main" className="flex-1">
          <Component {...pageProps} />
        </Clamp>
        <Footer className="p-8 bg-neutral text-neutral-content" center>
          <Footer.Title>
            &copy;{new Date().getFullYear()} &middot; Powered by AxelarUI
          </Footer.Title>
        </Footer>
      </div>
    </>
  );
}
