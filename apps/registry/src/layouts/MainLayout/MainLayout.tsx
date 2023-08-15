"use client";

import { Footer } from "@axelarjs/ui";
import { type FC, type PropsWithChildren } from "react";
import Link from "next/link";

import Appbar from "./Appbar";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col gap-4 lg:min-h-screen">
      <Appbar />
      {children}
      <Footer
        className="bg-neutral text-neutral-content p-6 md:p-8 xl:p-10"
        center={true}
      >
        <div className="flex items-center text-sm">
          &copy;{new Date().getFullYear()} <span>&middot;</span>
          <Link
            rel="noopener noreferrer"
            href="https://axelar.network"
            target="_blank"
            className="text-accent"
          >
            Axelar Network
          </Link>
        </div>
      </Footer>
    </div>
  );
};

export default MainLayout;
