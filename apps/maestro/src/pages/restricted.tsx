import { AlertTriangleIcon, Card } from "@axelarjs/ui";
import type { FC } from "react";

const RestrictedPage: FC = () => (
  <div className="absolute inset-0 z-10 grid min-h-[100dvh] place-items-center overflow-y-scroll bg-base-100">
    <Card className="bg-warning text-warning-content">
      <Card.Body>
        <Card.Title>
          <AlertTriangleIcon />
          Your access is restricted
        </Card.Title>
        Access from this wallet address, IP address or location is currently
        restricted.
      </Card.Body>
    </Card>
  </div>
);

export default RestrictedPage;
