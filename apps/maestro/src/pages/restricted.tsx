import { AlertTriangleIcon, Card } from "@axelarjs/ui";
import type { FC } from "react";

const RestrictedPage: FC = () => (
  <div className="bg-base-100 absolute inset-0 z-10 grid min-h-[100dvh] place-items-center overflow-y-scroll">
    <Card className="bg-warning text-warning-content">
      <Card.Body>
        <Card.Title>
          <AlertTriangleIcon />
          Your access is restricted
        </Card.Title>
        Access from this IP address or location is restricted.
      </Card.Body>
    </Card>
  </div>
);

export default RestrictedPage;
