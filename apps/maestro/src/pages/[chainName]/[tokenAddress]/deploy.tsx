import React from "react";

import { Card } from "@axelarjs/ui";

type Props = {};

const DeployInterchainToken = (props: Props) => {
  return (
    <div className="grid w-full place-items-center">
      <Card className="bg-base-200">
        <Card.Body>
          <Card.Title>Deploy Interchain Token</Card.Title>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeployInterchainToken;
