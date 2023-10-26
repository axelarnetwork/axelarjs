import type { FC } from "react";

import { RedocStandalone } from "redoc";

const DocsPage: FC = () => (
  <div className="absolute inset-0 min-h-[100dvh] overflow-y-scroll bg-white">
    <RedocStandalone specUrl="/api/openapi.json" />
  </div>
);

export default DocsPage;
