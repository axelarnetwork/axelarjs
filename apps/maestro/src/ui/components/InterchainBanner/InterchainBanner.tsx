import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { NEXT_PUBLIC_COMPETITION_START_TIMESTAMP } from "~/config/env";

export const InterchainBanner = () => (
  <div className="relative h-28 sm:h-32 md:h-40 lg:h-48 xl:h-56">
    <Image
      src="/ilustrations/interchain-competition.jpg"
      alt="Interchain Competition Banner"
      fill
    />
  </div>
);

export const ConditionalRenderInterchainBanner = () => {
  const [now] = useState(Date.now());
  const COMPETITION_START_TS = Date.parse(
    NEXT_PUBLIC_COMPETITION_START_TIMESTAMP
  );

  return (
    now > COMPETITION_START_TS && (
      <div className="mt-10 w-full">
        <Link href={`/competition`}>
          <InterchainBanner />
        </Link>
      </div>
    )
  );
};
