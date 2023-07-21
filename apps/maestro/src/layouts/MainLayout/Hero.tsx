import { Button } from "@axelarjs/ui";
import type { FC } from "react";

import { ChevronDownIcon } from "lucide-react";

import { APP_NAME } from "~/config/app";

type Props = {
  onCTAClick?: () => void;
};

export const Hero: FC<Props> = ({ onCTAClick }) => {
  return (
    <section
      className="hero animate-fade-in min-h-[100dvh] origin-center [animation-duration:1.5s]"
      style={{
        backgroundImage: "url(/ilustrations/hero3.webp)",
      }}
    >
      <div className="hero-overlay bg-opacity-50" />
      <div className="hero-content text-neutral-content translate-y-[30dvh] text-center md:-translate-y-[15dvh]">
        <div className="max-w-lg">
          <h1 className="mb-5 text-3xl font-black text-white/75 drop-shadow-lg md:text-5xl">
            {APP_NAME}
          </h1>
          <p className="mb-5 px-4 text-base text-white/60 drop-shadow-lg md:text-lg">
            Take your tokens Interchain with the {APP_NAME}
          </p>
          <Button
            variant="ghost"
            shape="circle"
            size="lg"
            className="bg-accent/25 animate-pulse"
            onClick={onCTAClick}
          >
            <ChevronDownIcon size="2.5rem" className="text-black/75" />
          </Button>
        </div>
      </div>
    </section>
  );
};
