import { Card } from "@axelarjs/ui";
import type { FC } from "react";

const RestrictedPage: FC = () => (
  <div className="absolute inset-0 grid min-h-[100dvh] place-items-center overflow-y-scroll bg-white">
    <Card>
      <Card.Title>Restricted Access</Card.Title>
      <Card.Body>
        Access from this IP address or location is restricted.
      </Card.Body>
    </Card>
  </div>
);

export default RestrictedPage;
