import { GridLoader } from "react-spinners";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[100dvh] place-items-center">
      <GridLoader
        color="var(--primary)"
        className="animate-pulse [animation-duration:3s]"
      />
    </div>
  ),
});

const SwaggerPage: NextPage = () => {
  // Serve Swagger UI with our OpenAPI schema
  return (
    <div className="absolute inset-0 z-10 min-h-[100dvh] overflow-y-scroll bg-white">
      <div className="container mx-auto">
        <SwaggerUI url="/api/openapi.json" />
      </div>
    </div>
  );
};

export default SwaggerPage;
