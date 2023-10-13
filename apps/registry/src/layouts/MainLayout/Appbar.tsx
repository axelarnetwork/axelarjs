import { AxelarIcon, Indicator, LinkButton, Navbar } from "@axelarjs/ui";
import { useIsSticky } from "@axelarjs/ui/hooks";
import { cn } from "@axelarjs/ui/utils";
import React, { type FC } from "react";

export type AppbarProps = {
  className?: string;
};

const APP_NAME = "Axelar Registry";

const Appbar: FC<AppbarProps> = (props) => {
  const isSticky = useIsSticky(100);

  return (
    <Navbar
      className={cn(
        "bg-base-100 sticky top-0 z-10 px-2 transition-all md:px-6",
        {
          "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
        },
        props.className
      )}
    >
      <Navbar.Start>
        <LinkButton
          className="flex items-center gap-2 text-lg font-bold uppercase"
          href="/"
          variant="ghost"
        >
          <AxelarIcon className="h-6 w-6 dark:invert" />
          <Indicator>
            <span>{APP_NAME}</span>
            {process.env.NEXT_PUBLIC_NETWORK_ENV !== "mainnet" && (
              <Indicator.Item
                size="xs"
                variant="success"
                position="bottom"
                className="translate-x-2 translate-y-2 lowercase"
              >
                {process.env.NEXT_PUBLIC_NETWORK_ENV}
              </Indicator.Item>
            )}
          </Indicator>
        </LinkButton>
      </Navbar.Start>
      <div className="hidden flex-none md:block" />
      <Navbar.End></Navbar.End>
    </Navbar>
  );
};

export default Appbar;
