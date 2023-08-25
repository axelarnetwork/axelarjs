import { cn } from "@axelarjs/ui/utils";
import { PropsWithChildren } from "react";
import { Cabin } from "next/font/google";

import MainLayout from "~/layouts/MainLayout";

import "./globals.css";

const font = Cabin({ subsets: ["latin"] });

type Props = PropsWithChildren;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={cn(font.className, "antialiased")}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
